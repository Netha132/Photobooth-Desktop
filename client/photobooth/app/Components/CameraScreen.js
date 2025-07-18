import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Webcam from 'react-webcam'; // ✅ Direct import

const assets = {
  background: require('../../assets/images/Asset 10.png'),
  flipIcon: require('../../assets/images/Asset 17.png'),
  cameraIcon: require('../../assets/images/Asset 16.png'),
  countdown3: require('../../assets/images/Asset 14.png'),
  countdown2: require('../../assets/images/Asset 13.png'),
  countdown1: require('../../assets/images/Asset 12.png'),
  submitIcon: require('../../assets/images/Asset 8.png'),
  homeIcon: require('../../assets/images/Asset 9.png'),
};

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const webcamRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [imageUri, setImageUri] = useState(null);
  const [facing, setFacing] = useState('user');
  const [countdown, setCountdown] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState(null);
  const [webcamAvailable, setWebcamAvailable] = useState(Platform.OS !== 'web');

  const router = useRouter();
  const { frame } = useLocalSearchParams();
  const selectedFrame = frame ? JSON.parse(frame) : null;

  const getDevices = useCallback(async () => {
    try {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = mediaDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoDevices);
      setDeviceId(videoDevices[0]?.deviceId);
      setWebcamAvailable(videoDevices.length > 0);
    } catch (err) {
      console.error('Camera access error:', err);
      setWebcamAvailable(false);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      if (!permission) requestPermission();
      if (!mediaPermission) requestMediaPermission();
    } else {
      getDevices();
    }
  }, []);

  const startCountdownAndCapture = () => {
    setIsOverlayVisible(true);
    setCountdown(3);
    let counter = 3;
    const interval = setInterval(() => {
      counter -= 1;
      if (counter === 0) {
        clearInterval(interval);
        setCountdown(null);
        capturePhoto();
      } else {
        setCountdown(counter);
      }
    }, 1000);
  };

  const capturePhoto = () => {
    if (Platform.OS === 'web') {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          setImageUri(imageSrc);
          setIsOverlayVisible(false);
        } else {
          Alert.alert('Error', 'Failed to capture webcam photo');
        }
      }
    } else {
      captureMobilePhoto();
    }
  };

  const captureMobilePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setImageUri(photo.uri);
        setIsOverlayVisible(false);
      } catch {
        Alert.alert('Error', 'Failed to take mobile photo');
      }
    }
  };

  const toggleCamera = () => {
    if (Platform.OS === 'web' && devices.length > 1) {
      const currentIndex = devices.findIndex((d) => d.deviceId === deviceId);
      const nextIndex = (currentIndex + 1) % devices.length;
      setDeviceId(devices[nextIndex].deviceId);
    } else {
      setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
    }
  };

  const getCountdownImage = () => {
    if (countdown === 3) return assets.countdown3;
    if (countdown === 2) return assets.countdown2;
    if (countdown === 1) return assets.countdown1;
    return null;
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facing,
    deviceId: deviceId ? { exact: deviceId } : undefined,
  };

  if (Platform.OS !== 'web' && (!permission?.granted || !mediaPermission?.granted)) {
    return <Text>Requesting mobile permissions...</Text>;
  }

  if (Platform.OS === 'web' && !webcamAvailable) {
    return (
      <ImageBackground source={assets.background} style={styles.background}>
        <View style={styles.permissionMessage}>
          <Text style={styles.permissionText}>
            {devices.length === 0 ? 'No camera found' : 'Please allow camera access in browser settings'}
          </Text>
          <TouchableOpacity onPress={getDevices} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={assets.background} style={styles.background}>
      <View style={styles.container}>
        {!imageUri ? (
          <>
            <View style={styles.cameraContainer}>
              {Platform.OS === 'web' ? (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  style={styles.webcam}
                  mirrored={facing === 'front'}
                />
              ) : (
                <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
              )}
              {isOverlayVisible && countdown && (
                <View style={styles.overlayFull}>
                  <Image source={getCountdownImage()} style={styles.countdownImage} />
                </View>
              )}
            </View>
            <View style={styles.controls}>
              {(Platform.OS !== 'web' || devices.length > 1) && (
                <TouchableOpacity onPress={toggleCamera}>
                  <Image source={assets.flipIcon} style={styles.icon} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={startCountdownAndCapture} disabled={countdown !== null}>
                <Image source={assets.cameraIcon} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.preview}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/Components/PreviewScreen',
                  params: { photoUri: imageUri, frame: JSON.stringify(selectedFrame) },
                })
              }
            >
              <Image source={assets.submitIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
        <Image source={assets.homeIcon} style={styles.homeIcon} />
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  cameraContainer: {
    width: 300,
    height: 400,
    marginTop: '5%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  webcam: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 150,
    height: 70,
    resizeMode: 'contain',
  },
  overlayFull: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  countdownImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  preview: {
    marginTop: '5%',
    alignItems: 'center',
    gap: 20,
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 15,
  },
  homeButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    zIndex: 20,
  },
  homeIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  permissionMessage: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
