import React, { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";


const ChatScreen = ({ }) => {
  const navigation = useNavigation();
  return (
    <view>
      <Ionicons name="ios-arrow-back" size={24} color="#52575D"
        onPress={() => navigation.goBack()}
      ></Ionicons>
      <h3>  ChatScreen   </h3>
    </view>)
}
export default ChatScreen;
