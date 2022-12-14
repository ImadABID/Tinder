import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignupScreen from './SignupScreen';
import LoginScreen from './LoginScreen';
import TinderCard from './TinderCard';
import ProfileScreen from './ProfileScreen';
import Matches from './Matches';
import ProfileScreenVisitor from './ProfileScreenVisitor';
import User from './User';
import Chat from './Chat';
import EditProfile from './EditProfile';
import CheckProfile from './CheckProfile';

ProfileScreenVisitor
const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Matches" component={Matches} />
        <Stack.Screen name="TinderCard" component={TinderCard} />
        <Stack.Screen name="CheckProfile" component={CheckProfile} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="ProfileScreenVisitor" component={ProfileScreenVisitor} />
        <Stack.Screen name="User" component={User} />
        <Stack.Screen name="Chat" component={Chat} />

      </Stack.Group>
    </Stack.Navigator>
  )
}

export default StackNavigator;