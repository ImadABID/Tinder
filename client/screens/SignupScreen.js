import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = ({}) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const navigation = useNavigation();

  // for test
  const [signUpButtonTitle, setSignUpButtonTitle] = useState("Sign up");

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create an account</Text>
      <FormInput
        labelValue={name}
        onChangeText={(userName) => setName(userName)}
        placeholderText="Name"
        iconType="user"
        keyboardType="name"
        autoCapitalize="none"
        autoCorrect={false}
      />
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

      <FormInput
        labelValue={confirmPassword}
        onChangeText={(userPassword) => setConfirmPassword(userPassword)}
        placeholderText="Confirm Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormButton
        buttonTitle={signUpButtonTitle}
        onPress={() => {
          let link = 'http://localhost:3000/users/register';

          //let myHeaders = new Headers();
          //myHeaders.append("Accept", "application/json, text/plain, */*");
          //myHeaders.append("Content-Type", "application/json");
          /*
            curl
              -X POST 
              -d 'username=lora'
              -d 'email=lora17@yml.fr'
              -d 'password=kona75mi:-)'
              http://localhost:3000/users/register
          */

          let data = {
            username : "imad",
            email : "imad.abid@nok.ts",
            password : "kona75mi:-)"
          }
          //let form_data = new FormData();
          //form_data.append("json", JSON.stringify(data));


          // let myInit = {
          //   method: 'POST',
          //   headers: myHeaders,
          //   body : form_data,
          //   mode: 'cors',
          //   cache: 'default'
          // };

          // let myInit = {
          //   method: 'POST',
          //   headers: {
          //     'Accept': 'application/json, text/plain, */*',
          //     'Content-Type': 'application/json'
          //   },
          //   body : JSON.stringify(data)
          // };

          let myInit = {
            method: 'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
            body: 'username=imad&email=imad.abid@nok.ts&password=kona75mi:-)'
          };

          fetch(link, myInit)
          .then((res)=>{return res.json();})
          .then(res =>{

            setSignUpButtonTitle(res.respond);
            console.log("done");

          })
          .catch(err =>{
              console.log(err);
          })
          .finally(()=>{

          });
        }}
      />





      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.navButtonText}>Have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Lato-Regular',
    color: 'grey',
  },
});
export default SignupScreen;