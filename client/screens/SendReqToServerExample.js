import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from 'react-native';
import { useState } from 'react';

const SendReqToServerExample = () => {
  const [text, setText] = useState("send req");
  return (
    <View>

      <Button
        title={text}
        onPress = { () =>{

          let link = 'http://localhost:3000/welcome'

          var myHeaders = new Headers();

          var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
          };

          fetch(link, myInit)
          .then((res)=>{return res.json();})
          .then(res =>{

            setText(res.respond);

          })
          .catch(err =>{
              console.log(err);
          })
          .finally(()=>{

          });

        }}
      />
      

    </View>
  );
}

export default SendReqToServerExample;