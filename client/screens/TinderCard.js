import React , { useEffect, useState } from 'react';
import { View, ImageBackground } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper';

import CardItem from '../components/CardItem';
import styles from '../assets/styles';
import Demo from '../assets/data/demo.js';


const TinderCard = () => {
  const t = {};

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