import React , { useEffect, useState } from 'react';
import { View, ImageBackground } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import CardItem from '../components/CardItem';
import styles from '../assets/styles';
import Demo from '../assets/data/demo.js';
import * as Location from 'expo-location';

const TinderCard = () => {
  const t = {};
  const [location, setLocation] = useState(null);
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
  console.log(haversine(start, end, {unit: 'meter'}))
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  console.log(text)
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