import React, { useState,useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as ip_server from './server_ip';

import Header from './Header';

import { useNavigation } from '@react-navigation/native';


var params2init = { first_time: 1 };

var host_name;

var userList;

const User = () => {

  const navigation = useNavigation();

  const at_start_up = async () => {

    if(params2init.first_time === 1){
      params2init.first_time = 0;

      let token = await SecureStore.getItemAsync('token');
      if (token) {
        //
        host_name = await ip_server.get_hostname();

        let data = 'token=' + token;
        let link = 'http://' + host_name + '/chat/contact_list';
        let init = {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },// this line is important, if this content-type is not set it wont work
          body: data

        };
        fetch(link, init)
          .then((res) => { return res.json(); })
          .then(res => {

            userList = res.contactProfiles;

          }).catch(err => {

            console.log(err)

          });
      } else {
        params2init.first_time = 1;
        log_out();
        navigation.navigate('LoginScreen');
      }

    }

  }

  useFocusEffect(
    React.useCallback(() => {
      at_start_up();
    })
  );

  
  return (
    <View style={styles.container}>

      <Header
        params2init={params2init}
        navigation={navigation}    
      />

      <FlatList
        style={{
          marginHorizontal: 15,
          marginTop: 20
        }}
        data={userList}
        keyExtractor={(item, index) => index.toString()} 
        renderItem={({ item, index }) =>
          <TouchableOpacity
            key={index}
            style={{
              padding: 10,
              elevation: 10,
              borderRadius: 10,
              borderWidth: 1,
              backgroundColor: '#ff',
              borderColor: '#ddd',
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: "center"
            }}
            onPress={() => {
              navigation.push('Chat',
                {
                  record: item,
                  host_name : host_name
                }
              )
            }}
          >
            <Image
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                borderWidth: 0.5,
                borderColor: '#ddd'
              }}
              source={{ uri: item.profileImage }}
              resizeMode='contain'
            />
            <Text
              style={{
                fontSize: 14,
                marginLeft: 20,
                fontWeight: '400'
              }}
            >
              {item.username + `\n` + item.email}
            </Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
export default User;
