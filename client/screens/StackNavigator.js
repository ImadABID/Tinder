import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignupScreen from './SignupScreen';
import LoginScreen from './LoginScreen';
import ProfileScreen from './ProfileScreen';
import ProfileScreenVisitor from './ProfileScreenVisitor';

import ChatScreen from './ChatScreen';
import EditProfile from './EditProfile';
ProfileScreenVisitor
const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="ProfileScreenVisitor" component={ProfileScreenVisitor} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default StackNavigator;