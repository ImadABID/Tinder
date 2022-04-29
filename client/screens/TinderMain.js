import React from 'react';
import TinderCard from './TinderCard';
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native';

import Header from './Header';

function TinderMain() {

  const navigation = useNavigation();

  return (
    <View>
      <Header
          navigation={navigation}
      />
      <TinderCard />
    </View>
  );
}
export default TinderMain;


