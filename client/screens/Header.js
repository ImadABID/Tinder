import React from 'react'
import { View, StyleSheet } from 'react-native'
import { FontAwesome5, FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
const refreshPage = ()=>{
  window.location.reload();
}
function Header() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <FontAwesome5 name="fire" size={27} color="#F06795" 
      />
      <FontAwesome name="comments" size={27} color="#5c5c5c" 
      onPress={() => navigation.navigate('Chattwo')}
      />
      <FontAwesome name="user" size={27} color="#5c5c5c"
        onPress={() => navigation.navigate('ProfileScreen')}>
      </FontAwesome>
    </View>
  )
}
export default Header;
const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5.46,
    elevation: 9,
  },
})