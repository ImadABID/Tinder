import React, {useState} from 'react';
import { View, ImageBackground, Modal, Text, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import CardItem from '../components/CardItem';
import styles from '../assets/styles';
import Demo from '../assets/data/demo.js';
import * as Location from 'expo-location';
import * as ip_server from './server_ip';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import data from './data';

async function log_out(){
  await SecureStore.deleteItemAsync('token');
}

var params2init = {first_time : 1};
var gps_first_time = 1;

var latitude;
var longitude;

var host_name;

var datadb_dom = [];

const TinderCard = () => {

  const navigation = useNavigation();
  const [Swiper , setSwiper] = useState();
  const [errorMsg, setErrorMsg] = useState(null);
  const [datadbReady, setDatadbReady] = useState(false);
  const [gettingLocationPopUp, setGettingLocationPopUp] = useState(true);

  const [noCardMsg, setNoCardMsg] = useState('');

  noCardMsg
  
  const send  = async (email,action ) => {

    let token = await SecureStore.getItemAsync('token');
    if (token) {
      let host_name = await ip_server.get_hostname();
      

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
          //console.log(res);
        }).catch(err => {
  
          console.log(err);
          params2init.first_time = 1;
          log_out();
          navigation.navigate('LoginScreen');
  
        });
    } else {
      params2init.first_time = 1;
      log_out();
      navigation.navigate('LoginScreen');
    }
  }

  const at_start_up = async () => {

    if(params2init.first_time === 1){
      
      params2init.first_time = 0;

      setDatadbReady(false);


      let token = await SecureStore.getItemAsync('token');
      if (token) {


        if(gps_first_time === 1){
          gps_first_time = 0;

          setGettingLocationPopUp(true);

          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          let location = await Location.getCurrentPositionAsync({});
          let text = 'Waiting..';
          if (errorMsg) {
            text = errorMsg;
          } else if (location) {
            latitude = location.coords.latitude;
            longitude = location.coords.longitude;


          }
          setGettingLocationPopUp(false);

          host_name = await ip_server.get_hostname();

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
            // console.log(res);
            if ( res.msg!='0' )
            {
              params2init.first_time = 1;
              navigation.navigate('CheckProfile');
            }
            else {
              
              datadb_dom = [];
              res.jsonAsArray.map(
                (item, index)=>{
                  if(item.hasOwnProperty('profileImage')){

                    datadb_dom.push(
                      <Card key={index}
                      onSwipedLeft = {()=>send (item.email , "no" )  }
                      onSwipedRight ={()=>send (item.email , "yes")  }
                      >
                        <TouchableOpacity
                          onPress={
                            () => {
                              params2init.first_time = 1;
                              navigation.navigate('ProfileScreenVisitor', {visited_user_email : item.email});
                            }
                          }
                        >
                          <CardItem
                            image={'http://'+host_name+'/get_image?filename='+item.profileImage}
                            name={item.username}
                            description={item.description}
                            matches={(parseInt( item.distance )).toString()}
                            actions
                            onPressLeft={() =>{   Swiper.swipeLeft() } }
                            onPressRight={() => {  Swiper.swipeRight() } }
                          />
                        </TouchableOpacity>
                      </Card>
                    );

                  }else{

                    datadb_dom.push(
                      <Card key={index}
                      onSwipedLeft = {()=>send (item.email , "no" )  }
                      onSwipedRight ={()=>send (item.email , "yes")  }
                      >
                        <TouchableOpacity
                          onPress={
                            () => {
                              params2init.first_time = 1;
                              navigation.navigate('ProfileScreenVisitor', {visited_user_email : item.email});
                            }
                          }
                        >
                          <CardItem
                            name={item.username}
                            description={item.description}
                            matches={(parseInt( item.distance )).toString()}
                            actions
                            onPressLeft={() =>{   Swiper.swipeLeft() } }
                            onPressRight={() => {  Swiper.swipeRight() } }
                          />
                        </TouchableOpacity>
                      </Card>
                    );

                  }
                }
              )
              setDatadbReady(true);
            }
          })
          .catch(err => {
            console.log(err);
            params2init.first_time = 1;
            log_out();
            navigation.navigate('LoginScreen');
          });


        }else{

          host_name = await ip_server.get_hostname();

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
            // console.log(res);
            if ( res.msg!='0' )
            {
              params2init.first_time = 1;
              navigation.navigate('CheckProfile');
            }
            else {
              
              datadb_dom = [];
              res.jsonAsArray.map(
                (item, index)=>{
                  if(item.hasOwnProperty('profileImage')){

                    datadb_dom.push(
                      <Card key={index}
                      onSwipedLeft = {()=>send (item.email , "no" )  }
                      onSwipedRight ={()=>send (item.email , "yes")  }
                      >
                        <TouchableOpacity
                          onPress={
                            () => {
                              params2init.first_time = 1;
                              navigation.navigate('ProfileScreenVisitor', {visited_user_email : item.email});
                            }
                          }
                        >
                          <CardItem
                            image={'http://'+host_name+'/get_image?filename='+item.profileImage}
                            name={item.username}
                            description={item.description}
                            matches={(parseInt( item.distance )).toString()}
                            actions
                            onPressLeft={() =>{   Swiper.swipeLeft() } }
                            onPressRight={() => {  Swiper.swipeRight() } }
                          />
                        </TouchableOpacity>
                      </Card>
                        
                    );

                  }else{

                    datadb_dom.push(
                      <Card key={index}
                      onSwipedLeft = {()=>send (item.email , "no" )  }
                      onSwipedRight ={()=>send (item.email , "yes")  }
                      >
                        <TouchableOpacity
                          onPress={
                            () => {
                              params2init.first_time = 1;
                              navigation.navigate('ProfileScreenVisitor', {visited_user_email : item.email});
                            }
                          }
                        >
                          <CardItem
                            name={item.username}
                            description={item.description}
                            matches={(parseInt( item.distance )).toString()}
                            actions
                            onPressLeft={() =>{   Swiper.swipeLeft() } }
                            onPressRight={() => {  Swiper.swipeRight() } }
                          />
                        </TouchableOpacity>
                      </Card>
                    );

                  }
                }
              )
              setDatadbReady(true);
            }
          })
          .catch(err => {
            console.log(err);
            params2init.first_time = 1;
            log_out();
            navigation.navigate('LoginScreen');
          });

        }
      
      } else {
        params2init.first_time = 1;
        log_out();
        navigation.navigate('LoginScreen');
      }

    }

  }

  useFocusEffect(
    React.useCallback(() => {
      at_start_up();
      
    })
  );

  return (

    <View style={styles.containerHome}>

      <Modal
        animationType="slide"
        transparent={true}
        visible={gettingLocationPopUp}
      >
        <View
          style={
            {
              marginTop : 200,
              justifyContent: 'center',
              alignItems: 'center'
            }
          }
        >
          <ActivityIndicator animating={true} color={Colors.red800} />
          <Text>
            Getting Location
          </Text>
        </View>
      </Modal>

      <Header
        params2init={params2init}
        navigation={navigation}
      />

      <Text style={{top : 200, left:80}}>{noCardMsg}</Text>

      <CardStack
        loop={false}
        verticalSwipe={false}
        renderNoMoreCards={() => setNoCardMsg('No profile left to match with.')}
        ref={swiper => { setSwiper(swiper)  }}
      >
        {
          datadbReady===true ?
              datadb_dom
          :
            <View></View>
        }
      </CardStack>
    </View>
  );
};

export default TinderCard;