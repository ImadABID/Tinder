import React, { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {  SafeAreaView} from "react-native";

import {
  Text,
  View,
} from 'react-native';
import Header from './Header';


const ChatScreen = ({ }) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
            <Header/>

      <Ionicons name="ios-arrow-back" size={24} color="#52575D"
        onPress={() => navigation.goBack()}
      ></Ionicons>
      <Text>
      ChatScreen
      </Text>
    </SafeAreaView>)
}
export default ChatScreen;
