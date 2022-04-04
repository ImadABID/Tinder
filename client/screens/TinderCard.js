import React, { useState } from "react";
import TinderCard from 'react-tinder-card';
import "./TinderCards.css"
import { FontAwesome } from '@expo/vector-icons'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

function TinderCards() {
    const [people,setPeople]=useState([
        {
        name:'Elon MAsk 1',
        url:"https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/d/9/a/d9a1058910_50163142_elon-musk1.jpg"
    },
    {
        name:'Elon MAsk 2',
        url:"https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/d/9/a/d9a1058910_50163142_elon-musk1.jpg"
    },
    {
        name:'Elon MAsk 3',
        url:"https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/d/9/a/d9a1058910_50163142_elon-musk1.jpg"
    },   
]);
const swiped=(direction,nameToDelete)=>{
    console.log("removing:  "+direction)
};
const outOfFrame=(name)=>{
    console.log(name+" left the screen !!")
};
    return(
        <div className="tinderCards">
            <div className="tinderCards_cardContainer">
                {people.map((person) => (
                    <TinderCard
                        className="swipe"
                        key={person.name}
                        preventSwipe={["up", "down"]}
                        onSwipe={(dir) =>swiped(dir,person.name)}
                        onCardLeftScreen={()=>outOfFrame(person.name)}
                    >
                    <div
                    style={{backgroundImage : `url(${person.url})`}} 
                    className="card" 
                    >
                    <h3>{person.name}</h3>
                    </div>
                    </TinderCard>
                ))}

            </div>
            <View style={styles.container}  >
            <TouchableOpacity  style={styles.button}
            onPress={(dir) =>swiped(dir)}
            >
                <FontAwesome name="times" size={27} color="#F06795"></FontAwesome>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} 
            onPress={(dir) =>swiped(dir)}
            >
                <FontAwesome name="heart" size={27} color="#64EDCC" ></FontAwesome>
            </TouchableOpacity>
            </View>
      </div>
    );
}
export default TinderCards; 

const styles = StyleSheet.create({
    container: {
      top : 450,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    button: {
      width: 50,
      height: 50,
      backgroundColor: 'white',
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6.46,
      elevation: 9,
    },
  })