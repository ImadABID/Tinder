import React, { useState } from "react";
import TinderCard from 'react-tinder-card';
import "./TinderCards.css"
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
      </div>
    );
}
export default TinderCards; 

