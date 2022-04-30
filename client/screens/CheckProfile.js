import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import Header from './Header';





const CheckProfile = ({}) => {

  const navigation = useNavigation();


  return (
    <View>
    <Header
      navigation={navigation}
    />

    <ScrollView contentContainerStyle={styles.container}>

      <Image
        source={require('../assets/rn-social-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>Some profile's info are missing</Text>

      <View
        style={{marginTop : 50}}
      >
        <Button
          title='update your profile'
          onPress={
            ()=>{
              navigation.navigate('EditProfile');
            }
          }
        >
        </Button>
      </View>

    </ScrollView>
    </View>

  );
};

export default CheckProfile;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
  },
  popup : {
    top : 100,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  error_msg : {
    fontSize: 13,
    fontWeight : 'bold',
    color : 'red'
  }
});
