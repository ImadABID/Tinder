import React, { useEffect, useState } from 'react';
import { View, ImageBackground } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import CardItem from '../components/CardItem';
import styles from '../assets/styles';
import Demo from '../assets/data/demo.js';
import * as Location from 'expo-location';
import * as ip_server from './server_ip';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import data from './data';

const TinderCard = () => {
  const [state, setState] = useState({});
  const navigation = useNavigation();
  const [Swiper , setSwiper] = useState();
  const [datadb, setDatadb] = useState([{}]);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const send  = async (email,action ) => {

    let token = await SecureStore.getItemAsync('token');
    if (token) {
      let host_name = await ip_server.get_hostname();
      setState({}); // This worked for me

      let data = 'token=' + token;
      let linkLoc = 'http://' + host_name + '/matches/set';
      data += "&email=" + email + "&action=" + action ;
      let reqLoc = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },// this line is important, if this content-type is not set it wont work
        body: data
  
      };
      fetch(linkLoc, reqLoc)
        .then((res) => { return res.json(); })
        .then(res => {
          
        }).catch(err => {
  
          console.log(err)
  
        });
    } else {
      navigation.navigate('LoginScreen');
    }
  }
  const at_start_up = async () => {
    let token = await SecureStore.getItemAsync('token');
    if (token) {
      //
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      var location = await Location.getCurrentPositionAsync({});
      let text = 'Waiting..';
      if (errorMsg) {
        text = errorMsg;
      } else if (location) {
        var latitude = location.coords.latitude;
        var longitude = location.coords.longitude;


      }
      //
      let host_name = await ip_server.get_hostname();

      let data = 'token=' + token;
      data = data + '&latitude=' + latitude + '&longitude=' + longitude;
      let linkLoc = 'http://' + host_name + '/users/setLocalisation';
      let reqLoc = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },// this line is important, if this content-type is not set it wont work
        body: data

      };
      fetch(linkLoc, reqLoc)
        .then((res) => { return res.json(); })
        .then(res => {
          setDatadb(res.jsonAsArray)
        }).catch(err => {
          console.log(err)
        });
    } else {
      navigation.navigate('LoginScreen');
    }
  }
  useEffect(
    React.useCallback(() => {
      at_start_up();
    })
  );

  return (

    <View style={styles.containerHome}>
      <View style={styles.top}>

      </View>

      <CardStack
        loop={true}
        verticalSwipe={false}
        renderNoMoreCards={() => null}
        ref={swiper => { setSwiper(swiper)  }}
      >
        {datadb.map((item, index) => (
          <Card key={index}
              onSwipedLeft = {()=>send (item.email , "no" )  }
              onSwipedRight ={()=>send (item.email , "yes")  }>
            <CardItem
              //image={ }
              name={item.username}
              description={item.description}
              matches={(parseInt( item.distance )).toString()}
              actions

              onPressLeft={() =>{   Swiper.swipeLeft() } }
              onPressRight={() => {  Swiper.swipeRight() } }
            />
          </Card>
        ))}
      </CardStack>
    </View>
  );
};

export default TinderCard;