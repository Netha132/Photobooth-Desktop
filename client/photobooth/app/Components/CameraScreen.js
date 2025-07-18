import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';

const assets = {
  background: require('../../assets/images/Asset 10.png'),
  flipIcon: require('../../assets/images/Asset 17.png'),
  cameraIcon: require('../../assets/images/Asset 16.png'),
  countdown3: require('../../assets/images/Asset 14.png'),
  countdown2: require('../../assets/images/Asset 13.png'),
  countdown1: require('../../assets/images/Asset 12.png'),
  submitIcon: require('../../assets/images/Asset 8.png'),
  homeIcon: require('../../assets/images/Asset 9.png'), // ✅ Home icon
};

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [imageUri, setImageUri] = useState(null);
  const [facing, setFacing] = useState('back');
  const [countdown, setCountdown] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const router = useRouter();
  const { frame } = useLocalSearchParams();
  const selectedFrame = frame ? JSON.parse(frame) : null;

  useEffect(() => {
    if (!permission) requestPermission();
    if (!mediaPermission) requestMediaPermission();
  }, [permission, mediaPermission]);

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

  const capturePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setImageUri(photo.uri);
        setIsOverlayVisible(false);
      } catch {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const toggleCamera = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const getCountdownImage = () => {
    if (countdown === 3) return assets.countdown3;
    if (countdown === 2) return assets.countdown2;
    if (countdown === 1) return assets.countdown1;
    return null;
  };

  if (!permission?.granted || !mediaPermission?.granted) {
    return <Text>Requesting permissions...</Text>;
  }

  return (
    <ImageBackground source={assets.background} style={styles.background}>
      <View style={styles.container}>
        {!imageUri ? (
          <>
            <View style={styles.cameraContainer}>
              <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
              {isOverlayVisible && countdown && (
                <View style={styles.overlayFull}>
                  <Image source={getCountdownImage()} style={styles.countdownImage} />
                </View>
              )}
            </View>
            <View style={styles.controls}>
              <TouchableOpacity onPress={toggleCamera}>
                <Image source={assets.flipIcon} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={startCountdownAndCapture} disabled={countdown !== null}>
                <Image source={assets.cameraIcon} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.preview}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/Components/PreviewScreen',
                params: { photoUri: imageUri, frame: JSON.stringify(selectedFrame) },
              })}
            >
              <Image source={assets.submitIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ✅ Home button in bottom-left corner */}
      <TouchableOpacity 
        style={styles.homeButton}
        onPress={() => router.push('/')}
      >
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
    alignItems: 'center' 
  },
  container: { 
    flex: 1, 
    width: '100%', 
    alignItems: 'center' 
  },
  cameraContainer: { 
    width: 300, 
    height: 400, 
    marginTop: '40%', 
    borderRadius: 10, 
    overflow: 'hidden', 
    backgroundColor: '#000' 
  },
  camera: { 
    width: '100%', 
    height: '100%' 
  },
  controls: { 
    flexDirection: 'row', 
    marginTop: 30, 
    gap: 20 
  },
  icon: { 
    width: 150, 
    height: 70, 
    resizeMode: 'contain' 
  },
  overlayFull: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 10 
  },
  countdownImage: { 
    width: 120, 
    height: 120, 
    resizeMode: 'contain' 
  },
  preview: { 
    marginTop: "40%", 
    alignItems: 'center', 
    gap: 20 
  },
  image: { 
    width: 300, 
    height: 400, 
    borderRadius: 15 
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
});
