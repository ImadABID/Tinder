import React from 'react';
import TinderCard from './TinderCard';
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native';

function TinderMain() {

  const navigation = useNavigation();

  return (
    <View>
      <TinderCard />
    </View>
  );
}
export default TinderMain;


