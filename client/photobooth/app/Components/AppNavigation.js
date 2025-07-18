// AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../index';
import FrameSelectionScreen from './FrameSelectionScreen';
import CameraScreen from './CameraScreen';
import PreviewScreen from './PreviewScreen';
import ThankyouScreen from './ThankyouScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="FrameSelection" component={FrameSelectionScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="PreviewScreen" component={PreviewScreen} />
        <Stack.Screen name="ThankyouScreen" component={ThankyouScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
