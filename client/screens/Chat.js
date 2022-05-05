
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


const Chat = () => {

  const navigation = useNavigation()
  const route = useRoute();

  const [receiverProfile, setReceiverProfile] = useState(route.params.record);
  const [senderProfile, setSenderProfile] = useState(null);

  const [messages, setMessages] = useState([]);

  const [senderId, setSenderId] = useState(route.params.record.sender_id)
  const [receiverId, setReceiverId] = useState(route.params.record.receiver_id)
  const [name, setName] = useState(route.params.record.name)
  const [image_path, setImage_path] = useState(route.params.record.image_path)
  const ws = useRef(null);
  const [port, setPort] = useState("0");
  const [tmp, setTmp] = useState();

  const startup = async () => {

    if(params2init.first_time === 1){
      
      params2init.first_time = 0;

      let token = await SecureStore.getItemAsync('token');
      if (token) {

        host_name = await ip_server.get_hostname();

        let link = 'http://' + host_name + '/users/profile';

        let data = 'token=' + token;

        let myInit = {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // this line is important, if this content-type is not set it wont work
          body: data
        };

        fetch(link, myInit)
          .then((res) => { return res.json(); })
          .then(res => {

            setSenderProfile(res.client);

            // get_messages

            let data = 'token=' + token;

            let link = 'http://' + host_name + '/socket';
            let init = {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },// this line is important, if this content-type is not set it wont work
              body: data
            };

            fetch(link, init)
              .then((res) => { return res.json(); })
              .then(res => {

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
                  const response = JSON.parse(e.data).msg1;
                  console.log("onmessage=>", JSON.stringify(response));
                  let sentMessages = {
                    _id: Math.floor(Math.random() * 1000),
                    text: response.message,
                    createdAt: response.createdAt,
                    user: {
                      _id: response.senderId,
                      name: name,
                      avatar: image_path,
                    },
                  }
                  setMessages(previousMessages => GiftedChat.append(previousMessages, sentMessages))
                }

              }).catch(err => {

                console.log(err);

              });


          }).catch(err => {
            params2init.first_time = 1;
            log_out();
            navigation.navigate('LoginScreen');
          });

      } else {
        navigation.navigate('LoginScreen');
      }
    
    }

    
  }

  useEffect(() => {
    startup();
    return () => {
      if (ws.current != null) {
        ws.current.close();
      }
    };
  }
  );



  const onSend = useCallback(async (messages = [], senderEmail, receiverEmail) => {

    if (ws.current != null) {

      let message_obj;
      message_obj.senderEmail = senderEmail;
      message_obj.receiverEmail = receiverEmail;
      message_obj.message = messages[0].text;

      ws.current.send(message_obj);

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
        senderProfile != null?
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: senderProfile.email,  // set sender id
          }}
        />
        :
        <View></View>
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
