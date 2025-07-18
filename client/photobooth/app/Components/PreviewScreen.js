import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Alert,
  Text,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { router } from 'expo-router';

const backgroundImg = require('../../assets/images/Asset 10.png');
const retakeIcon = require('../../assets/images/Asset 17.png');
const emailIcon = require('../../assets/images/Asset 18.png');
const submitButtonImage = require('../../assets/images/Asset 8.png');

export default function PreviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { photoUri, frame } = route.params || {};
  const parsedFrame = frame ? JSON.parse(frame) : null;

  const viewShotRef = useRef();

  const [showEmailOverlay, setShowEmailOverlay] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const captureFramedPhoto = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: 'jpg',
        quality: 1,
      });

      return uri;
    } catch (error) {
      console.error('Error capturing view:', error);
      throw error;
    }
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const framedUri = await captureFramedPhoto();

      const formData = new FormData();
      formData.append('email', email);
      formData.append('photo', {
        uri: framedUri,
        type: 'image/jpeg',
        name: 'framed_photo.jpg',
      });

      const response = await fetch('http://192.168.172.184:5000/send-email', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Photo has been sent to your email!');
        setShowEmailOverlay(false);
        router.push('/Components/ThankyouScreen');
      } else {
        throw new Error(result.message || 'Failed to send email');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      <View style={styles.container}>
        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
          <View style={styles.previewWrapper}>
            {photoUri && <Image source={{ uri: photoUri }} style={styles.previewImage} />}
            {parsedFrame?.source && <Image source={parsedFrame.source} style={styles.frameOverlay} />}
          </View>
        </ViewShot>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/Components/FrameSelectionScreen', { frame })}
          >
            <Image source={retakeIcon} style={styles.iconImage} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowEmailOverlay(true)}
          >
            <Image source={emailIcon} style={styles.iconImage} />
          </TouchableOpacity>
        </View>

        {showEmailOverlay && (
          <View style={styles.overlay}>
            <View style={styles.overlayContent}>
              <Text style={styles.overlayTitle}>Email ID:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleEmailSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Image source={submitButtonImage} style={styles.buttonImage} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  previewWrapper: {
    width: 250,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#fff',
  },
  previewImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  frameOverlay: {
    position: 'absolute',
    width: '200%',
    height: '100%',
    resizeMode: 'contain',
    zIndex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 20,
  },
  iconButton: {
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  iconImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  overlayTitle: {
    fontSize: 18,
    color: '#007aff',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    padding: 12,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    width: 130,
    height: 40,
  },
  buttonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
