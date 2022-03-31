import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProfilScreen from './screens/ProfilScreen';
import LoginScreen from './screens/LoginScreen';
import SingipScreen from './screens/SignupScreen';
import SendReqToServerExample from './screens/SendReqToServerExample';

import { Button, Alert } from 'react-native';
import { useState } from 'react';

const AppSignUp = () => {
  const [text, setText] = useState('');
  return (
    <View>
      
      <SendReqToServerExample/>

    </View>
  );
}


export default AppSignUp;