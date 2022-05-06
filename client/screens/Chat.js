
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ip_server from './server_ip';
import * as SecureStore from 'expo-secure-store';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GiftedChat } from 'react-native-gifted-chat'
import Header from './Header';


async function log_out() {
  await SecureStore.deleteItemAsync('token');
}

var params2init = { first_time: 1 };

var receiverProfile;
var senderProfile;

var host_name;

const Chat = () => {

  const navigation = useNavigation()
  const route = useRoute();

  receiverProfile = route.params.record;
  host_name = route.params.host_name;

  const [senderProfileDefined, setSenderProfileDefined] = useState(false);

  const [messages, setMessages] = useState([]);

  const startup = async () => {

    if(params2init.first_time === 1){
      
      params2init.first_time = 0;

      const get_sender_profile = (token, host_name)=>{

        return new Promise(
          (resolve)=>{

            let link = 'http://' + host_name + '/users/profile';

            let data = 'token=' + token;

            let myInit = {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // this line is important, if this content-type is not set it wont work
              body: data
            };

            fetch(link, myInit)
            .then((res)=>{return res.json()})
            .then((res)=>{
              resolve(res.client);
            })
            .catch(err => {
              params2init.first_time = 1;
              log_out();
              navigation.navigate('LoginScreen');
            });
          }
        )

      }

      const get_socket_port_and_msg = (token, host_name) => {

        let data = 'token=' + token;
        let link = 'http://' + host_name + '/socket';
        let init = {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },// this line is important, if this content-type is not set it wont work
          body: data
        };

        fetch(link, init)
        .then((res) => { return res.json(); })
        .then(async (res) => {


          let host_name_and_port = host_name.split(':');

          // getting already received msg
          for (msg_i in res.messages_list) {

            let user_profile;
            if (response.messages_list[i].senderEmail == senderProfile.email) {
              user_profile = senderProfile;
            } else {
              user_profile = receiverProfile;
            }

            let sentMessages = {
              _id: Math.floor(Math.random() * 1000),
              text: res.messages_list[i].message,
              // createdAt: response.createdAt,
              user: {
                _id: user_profile.email,
                name: user_profile.username,
                avatar: user_profile.profileImage,
              },
            }

            setMessages(previousMessages => GiftedChat.append(previousMessages, sentMessages));

          }

          console.log("initiateSocketConnection");

          ws.current = new WebSocket('http://' + host_name_and_port[0] + ':' + res.respond.port + '/');
          ws.current.onopen = () => {
            console.log("connection establish open")
          };
          ws.current.onclose = () => {
            console.log("connection establish closed");
          }
          ws.current.onmessage = e => {
            const response = JSON.parse(e.data).msg_json;
            console.log("onmessage=>", JSON.stringify(response));

            let user_profile;
            if (response.senderEmail === senderProfile.email) {
              user_profile = senderProfile;
            } else {
              user_profile = receiverProfile;
            }

            let sentMessages = {
              _id: Math.floor(Math.random() * 1000),
              text: response.message,
              // createdAt: response.createdAt,
              user: {
                _id: user_profile.email,
                name: user_profile.username,
                avatar: user_profile.profileImage,
              },
            }
            setMessages(previousMessages => GiftedChat.append(previousMessages, sentMessages))
          }
        })
        .catch(err => {
          params2init.first_time = 1;
          log_out();
          navigation.navigate('LoginScreen');
        });

      }

      let token = await SecureStore.getItemAsync('token');
      if (token) {

        // getting profile info
        senderProfile = await get_sender_profile(token, host_name);
        let msg = {type : "declaring_email", email : senderProfile.email}
        ws.send(JSON.stringify(msg));
        setSenderProfileDefined(true);

        // get_msg(token, host_name);

        // openning socket


      } else {
        params2init.first_time = 1;
        log_out();
        navigation.navigate('LoginScreen');
      }
    
    }
 
  }

  useFocusEffect(() => {
    startup();
  });

  // --- web socket ---

  let hots_and_port = host_name.split(':');
  let just_host_name  = hots_and_port[0];
  var ws = React.useRef(new WebSocket('ws://'+just_host_name+':3005')).current;

  React.useEffect(() => {

    ws.onopen = () => {
      setServerState('Connected to the server');
    };
    ws.onclose = (e) => {
      setServerState('Disconnected. Check internet or server.')
    };
    ws.onerror = (e) => {
      
    };
    ws.onmessage = (e) => {

      let msg_json = e.data;
      console.log(msg_json);
      
      console.log(msg_json['message']);

      let user_profile;
      if (msg_json.senderEmail === senderProfile.email) {
        user_profile = senderProfile;
      } else {
        user_profile = receiverProfile;
      }

      let sentMessages = {
        _id: Math.floor(Math.random() * 1000),
        text: 'msg_json.message',
        // createdAt: response.createdAt,
        user: {
          _id: user_profile.email,
          name: user_profile.username,
          avatar: user_profile.profileImage,
        }
      }
      console.log(sentMessages);
      setMessages(previousMessages => GiftedChat.append(previousMessages, sentMessages));
    };
  }, []);



  const onSend = useCallback(async (messages = []) => {

    if (ws != null) {

      let message_obj = {};
      message_obj.senderEmail = senderProfile.email;
      message_obj.receiverEmail = receiverProfile.email;
      message_obj.message = messages[0].text;

      console.log(message_obj);

      ws.send(JSON.stringify(message_obj));

    }

  });

  return (
    <View style={styles.container}>
      <Header
        params2init={params2init}
        navigation={navigation}
      />

      <View style={{
        padding: 15,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: 'center',
        width: '100%'
      }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 10,
            borderColor: "#fff",
            borderWidth: 1,
            padding: 7,
            borderRadius: 10
          }}
          onPress={() => {
            params2init.first_time = 1;
            navigation.goBack()
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: "#fff",
            }}
          >{`Back`}</Text>
        </TouchableOpacity>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: "#fff"
        }}>
          {receiverProfile.username}
        </Text>
      </View>
      {
        senderProfileDefined === true?    
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: senderProfile.email,  // set sender id
          }}
        />
        :
        <View>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
export default Chat;
