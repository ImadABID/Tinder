import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  Modal
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import { useNavigation } from '@react-navigation/native';

import * as SecureStore from 'expo-secure-store';

import * as ip_server from './server_ip';


async function signup(value) {
  await SecureStore.setItemAsync('token', value);
}

const LoginScreen = ({}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigation = useNavigation();

//  const {login, googleLogin, fbLogin} = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);
  var serverIp = 'localhost';
  var serverPort = '3000';
  //const [serverIp, setServerIp] = useState('localhost');
  //const [serverPort, setServerPort] = useState('3000');

  useEffect(async ()=>{

    let ip = serverIp;
    let port = serverPort;
    ip_server.verify(setModalVisible, ip, port);

    let result = await SecureStore.getItemAsync('token');
    if (result) {
      navigation.navigate('ProfileScreen');
    }

  })

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/rn-social-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>RastaZulu App</Text>

      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormButton
        buttonTitle="Sign In"
        onPress = {()=>{
          signup("1337");
          navigation.navigate('ProfileScreen');
        }}
      />

      <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity>



      <TouchableOpacity
        style={styles.forgotButton}
        >
        <Text style={styles.navButtonText}
         onPress={() => navigation.navigate('SignupScreen')}
         >
          Don't have an acount? Create here
        </Text>
      </TouchableOpacity>

      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={
              () => {
                  // setModalVisible(true);
              }
          }
      >
        <View style={styles.popup}>
          <Text>
              Can't find the server.
          </Text>
          <Text>
            Please Type ip and port :
          </Text>
          <TextInput
            style={{height: 40}}
            placeholder="ip"
            onChangeText={newText => serverIp = newText}
            defaultValue={serverIp}
          />
          <TextInput
            style={{height: 40}}
            placeholder="port"
            onChangeText={newText => serverPort = newText}
            defaultValue={serverPort}
          />
          <Button
            title = 'Test connection'
            onPress={
              ()=>{
                setModalVisible(false);
                ip_server.verify(setModalVisible, serverIp, serverPort);
              }
            }
          />

        </View>
      </Modal>
      
    </ScrollView>
  );
};

export default LoginScreen;

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
    fontFamily: 'Kufam-SemiBoldItalic',
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
    fontFamily: 'Lato-Regular',
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
  }
});
