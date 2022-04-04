import React from 'react';
import  LoginScreen from './screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native'; 
import StackNavigator from './screens/StackNavigator';



export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator/>
    </NavigationContainer>
  );
}

 
