import React , { useEffect, useState } from 'react';
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

const TinderCard = () => {
  const navigation = useNavigation();

  const t = {};
  const [location] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const haversine = require('haversine')
  const start = {
    latitude: 30.849635,
    longitude: -83.24559
  }
  const end = {
    latitude: 27.950575,
    longitude: -82.457178
  }
  console.log( "la distance est = " + haversine(start, end, {unit: 'meter'}))
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
    })();
  }, []);
  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    var latitude = location.coords.latitude;
    var longitude = location.coords.latitude;

    
  }
  const at_start_up = async () => {
        
    let token = await SecureStore.getItemAsync('token');
    if (token) {
        
        let host_name = await ip_server.get_hostname();
        let link = 'http://'+host_name+'/users/profile';

        let data = 'token='+token;

        let myInit = {
            method: 'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
            body: data
        };

        fetch(link, myInit)
        .then((res)=>{return res.json();})
        .then( res =>{

          if(res.client.hasOwnProperty('email')){
                let data = 'email='+res.client.email + '&latitude=' + latitude + '&longitude=' + longitude; 
                let linkLoc = 'http://'+host_name+'/users/setLocalisation';
                let reqLoc = {
                  method: 'POST',
                  headers: {'Content-Type':'application/x-www-form-urlencoded'},// this line is important, if this content-type is not set it wont work
                  body: data             

              };
              fetch(linkLoc, reqLoc)
              .then((resLoc)=>{return resLoc.json();})
              .then( resLoc =>{        
                console.log(resLoc)
              }).catch(errloc => {
                console.log("something wrong in Localisation")
              });
            }

        }).catch(err => {
          console.log(err)
        });
        
    }else{
        navigation.navigate('LoginScreen');
    }
}
  useFocusEffect(
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
          ref={swiper => { t.swiper = swiper }}
        >
          {Demo.map((item, index) => (
            <Card key={index}>
              <CardItem
                image={item.image}
                name={item.name}
                description={item.description}
                matches={item.match}
                actions
                onPressLeft={() => t.swiper.swipeLeft()}
                onPressRight={() => t.swiper.swipeRight()}
              />
            </Card>
          ))}
        </CardStack>
      </View>
  );
};

export default TinderCard;