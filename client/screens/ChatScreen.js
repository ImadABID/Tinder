import React, { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  View,
} from 'react-native';

const ChatScreen = ({ }) => {
  const navigation = useNavigation();
  return (
    <View>
      <Ionicons name="ios-arrow-back" size={24} color="#52575D"
        onPress={() => navigation.goBack()}
      ></Ionicons>
      ChatScreen
    </View>)
}
export default ChatScreen;
