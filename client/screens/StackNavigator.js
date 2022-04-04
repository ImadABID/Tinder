import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignupScreen from './SignupScreen';
import LoginScreen from './LoginScreen';
import TinderMain from './TinderMain';

const Stack = createNativeStackNavigator(); 
const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Group>
      <Stack.Screen name = "TinderMain" component={TinderMain}/>
      <Stack.Screen name = "SignupScreen" component={SignupScreen}/>
      <Stack.Screen name = "LoginScreen" component={LoginScreen}/>
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default StackNavigator;