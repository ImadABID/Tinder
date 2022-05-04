
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

var params2init = { first_time: 1 };

const Chat = () => {
  const navigation = useNavigation()
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [senderId, setSenderId] = useState(route.params.record.sender_id)
  const [receiverId, setReceiverId] = useState(route.params.record.receiver_id)
  const [name, setName] = useState(route.params.record.name)
  const [image_path, setImage_path] = useState(route.params.record.image_path)
  const ws = useRef(null);
  const [port, setPort] = useState("0");
  const [tmp, setTmp] = useState();


  const startup = async() => {

        
          let token = await SecureStore.getItemAsync('token');
          if (token) {
            //
            host_name = await ip_server.get_hostname();

            let data = 'token=' + token;
            let linkLoc = 'http://' + host_name + '/socket';
            let reqLoc = {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },// this line is important, if this content-type is not set it wont work
              body: data

            };
            fetch(linkLoc, reqLoc)
              .then((res) => { return res.json(); })
              .then(res => {
                console.log("initiateSocketConnection")
                // enter your websocket url
                ws.current = new WebSocket('ws://192.168.153.124:' + res.respond + '/');
                ws.current.onopen = () => {
                  console.log("connection establish open")

                };
                ws.current.onclose = () => {
                  console.log("connection establish closed");
                }
                ws.current.onmessage = e => {
                  const response = JSON.parse(e.data).msg1;
                  console.log("onmessage=>", JSON.stringify(response));
                  var sentMessages = {
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

                console.log(err)

              });

          } else {
            navigation.navigate('LoginScreen');
          }
  }

  useEffect(() => {
       startup();
      return () => {
        ws.current.close();
      };
    }
  );



  const onSend = useCallback(async (messages = []) => {
    if ( ws.current!= null ){
    let obj = {
      "senderId": senderId,
      "receiverId": receiverId,
      "receiverEmail" : "imad", 
      "message": messages[0].text,
      "action": "message"
    }
    ws.current.send(JSON.stringify(obj))
  }})

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
        }}>{`User name`}</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: senderId,  // set sender id
        }}
      />
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
