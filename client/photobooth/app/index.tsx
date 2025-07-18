import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/Asset 2.png')} 
        style={styles.backgroundImage}
      />
      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => router.push('/Components/FrameSelectionScreen')}
      >
        <Image 
          source={require('../assets/images/Asset 1.png')} 
          style={styles.buttonImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  startButton: {
    position: 'absolute',
    bottom: 50,
  },
  buttonImage: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
  }
});

export default WelcomeScreen;
