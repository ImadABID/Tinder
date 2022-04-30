import React, {Component} from 'react'
import { View, StyleSheet,SafeAreaView } from 'react-native'
import { FontAwesome5, FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
const refreshPage = ()=>{
  window.location.reload();
}

class Header extends Component {
  render() {
    // const navigation = useNavigation();
    return (
      <View style={styles.container}>
  
        <FontAwesome5 name="fire" size={27} color="#F06795" 
          onPress={
            () => {
              if(this.props.hasOwnProperty('params2init')){
                this.props.params2init.first_time = 1;
              }
              this.props.navigation.navigate('TinderCard');
            }
          }
        />
  
        <FontAwesome name="comments" size={27} color="#5c5c5c" 
          onPress={
            () => {
              if(this.props.hasOwnProperty('params2init')){
                this.props.params2init.first_time = 1;
              }
              this.props.navigation.navigate('ChatScreen');
            }
          }
        />
  
        <FontAwesome name="heart" size={27} color="#5c5c5c" 
          onPress={
            () => {
              if(this.props.hasOwnProperty('params2init')){
                this.props.params2init.first_time = 1;
              }
              this.props.navigation.navigate('Matches');
            }
          }
        />
  
        <FontAwesome name="user" size={27} color="#5c5c5c"
          onPress={
            () => {
              if(this.props.hasOwnProperty('params2init')){
                this.props.params2init.first_time = 1;
              }
              this.props.navigation.navigate('ProfileScreen');
            }
          }
        />
  
      </View>
    );
  }
}

export default Header;
const styles = StyleSheet.create({
  container: {
    height: 60,
    marginTop:50,
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