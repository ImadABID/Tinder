import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignupScreen from './SignupScreen';
import LoginScreen from './LoginScreen';
import TinderMain from './TinderMain';
import ProfileScreen from './ProfileScreen';
import Matches from './Matches';
import ProfileScreenVisitor from './ProfileScreenVisitor';
import Chattwo from './Chattwo'
import ChatScreen from './ChatScreen';
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
      <Stack.Screen name="TinderMain" component={TinderMain} />
      <Stack.Screen name="CheckProfile" component={CheckProfile} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="ProfileScreenVisitor" component={ProfileScreenVisitor} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Chattwo" component={Chattwo} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default StackNavigator;