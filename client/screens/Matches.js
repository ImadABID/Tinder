import React, {useState} from 'react';
import styles from '../assets/styles';
import Header from './Header';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import * as ip_server from './server_ip';
import * as SecureStore from 'expo-secure-store';

async function log_out(){
  await SecureStore.deleteItemAsync('token');
}

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

var params2init = {first_time : 1};
var datadb = [];

var host_name;

const Matches = () => {
  const navigation = useNavigation();


  // only to oblige refresh
  const [state, setState] = useState({});
  
  
  const at_start_up = async () => {

    if(params2init.first_time === 1){
      params2init.first_time = 0;

      let token = await SecureStore.getItemAsync('token');
      if (token) {
        //
        host_name = await ip_server.get_hostname();

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

            if(res.jsonAsArray[0].hasOwnProperty('email')){
              datadb = res.jsonAsArray;
            }

            

            console.log(datadb);

          }).catch(err => {

            console.log(err)

          });
      } else {
        params2init.first_time = 1;
        log_out();
        navigation.navigate('LoginScreen');
      }

    }

  }

  useFocusEffect(
    React.useCallback(() => {
      if(state){
        // console.log('useFocusEffect');
      }
      at_start_up();
      
    })
  );

  


  return (
    <ImageBackground
      source={require('../assets/images/bg.png')}
      style={styles.bg}
    >
      <Header
        params2init={params2init}
        navigation={navigation}
      />
      <View style={styles.containerMatches}>
        <ScrollView>
          <View style={styles.top}>
            <Text style={styles.title}>Matches</Text>
            <Ionicons name="refresh-outline" size={24} color="#52575D"
                onPress={() => {setState({}); params2init.first_time = 1; navigation.navigate('Matches');}}
            ></Ionicons>
          </View>

          {
            datadb.length > 0 ?
            <FlatList
              numColumns={2}
              data={datadb}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                onPress={
                  () => {
                    params2init.first_time = 1;
                    navigation.navigate('ProfileScreenVisitor', {visited_user_email : item.email});
                  }
                }

                >

                  {
                    item.hasOwnProperty('profileImage') ?
                    <CardItem
                      image={'http://'+host_name+'/get_image?filename='+item.profileImage}
                      name={item.username}
                      variant
                    />
                    :
                    <CardItem
                      name={item.username}
                      variant
                    />
                  }

                </TouchableOpacity>
              )}
            />
            :<View></View>
            
          }

        </ScrollView>
      </View>
    </ImageBackground>
    
  );
};

export default Matches;