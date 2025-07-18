import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const backgroundImg = require('../../assets/images/Asset 19.png');
const homeButtonImage = require('../../assets/images/Asset 9.png');

export default function ThankyouScreen() {
  const navigation = useNavigation();

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('index')}
      >
        <Image source={homeButtonImage} style={styles.homeImage} />
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '105%',
    height: '105%',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 20,

  },
  homeButton: {
    marginBottom: 20,
    marginLeft: 10,
  },
  homeImage: {
    width: 50,
    height: 70,
    resizeMode: 'contain',
  },
});
