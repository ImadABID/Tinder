import React, {useState} from 'react';
import styles from '../assets/styles';
import Header from './Header';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import * as ip_server from './server_ip';
import * as SecureStore from 'expo-secure-store';

import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  FlatList
} from 'react-native';
import CardItem from '../components/CardItem';
import Icon from '../components/Icon';
import Demo from '../assets/data/demo.js';

var first_time = 1;

const Matches = () => {
  const navigation = useNavigation();
  const [datadb, setDatadb] = useState([{}]);


  // only to oblige refresh
  const [state, setState] = useState({});
  
  
  const at_start_up = async () => {

    if(first_time === 1){
      first_time = 0;

      let token = await SecureStore.getItemAsync('token');
      if (token) {
        //
        let host_name = await ip_server.get_hostname();

        let data = 'token=' + token;
        let linkLoc = 'http://' + host_name + '/matches/get';
        let reqLoc = {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },// this line is important, if this content-type is not set it wont work
          body: data

        };
        fetch(linkLoc, reqLoc)
          .then((res) => { return res.json(); })
          .then(res => {
            //console.log("aaa :"  +res.jsonAsArray );
            setDatadb(res.jsonAsArray)
            console.log(res.jsonAsArray);
          }).catch(err => {

            console.log(err)

          });
      } else {
        first_time = 1;
        navigation.navigate('LoginScreen');
      }

    }

  }

  useFocusEffect(
    React.useCallback(() => {
      if(state){
        console.log('useFocusEffect');
      }
      at_start_up();
      
    })
  );


  return (
    <ImageBackground
      source={require('../assets/images/bg.png')}
      style={styles.bg}
    >
          <Header/>
      <View style={styles.containerMatches}>
        <ScrollView>
          <View style={styles.top}>
            <Text style={styles.title}>Matches</Text>
            <Ionicons name="refresh-outline" size={24} color="#52575D"
                onPress={() => {console.log('ref clicked'); setState({}); first_time = 1; navigation.navigate('Matches');}}
            ></Ionicons>
          </View>

          <FlatList
            numColumns={2}
            data={datadb}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
              onPress={
                () => {
                  first_time = 1;
                  navigation.navigate('ProfileScreenVisitor');
                }
              }

              >
                <CardItem
                  //image={item.image}
                  name={item.username}
                  //status={item.status}
                  variant
                />
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </View>
    </ImageBackground>
    
  );
};

export default Matches;