const express = require("express");
const app = express();

const bcrypt = require('bcryptjs');


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions)) // Use this after the variable declaration

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017';

// On ouvre une connexion à notre base de données
MongoClient.connect(url)
// On commence par récupérer la collection que l'on va utiliser et la passer
.then(function (client) {
  return client.db("tinderb").collection("users");
})
.then((users) => {

  // Rajouter vos routes et les traitements

  // just for test in dev mode
  app.get('/welcome', (req, res)=>{
      res.json({respond:"Hello_World"});
  });

  app.post('/users/register', (req, res)=>{

    /*
      curl
        -X POST 
        -d 'username=lora'
        -d 'email=lora17@yml.fr'
        -d 'password=kona75mi:-)'
        http://localhost:3000/users/register
    */

    client = {}

    client.username = req.body.username;
    client.email = req.body.email;
    let salt = bcrypt.genSaltSync(10);
    client.hashed_password = bcrypt.hashSync(req.body.password, salt);

    users.insertOne(client, (insertOne_err, insertOne_res)=>{
        //res.send("client_registerd");
        res.json({respond:"client_registerd"});
    });
  });

  // just for test in dev mode
  app.post('/users/is_registered', (req, res)=>{
    
    /*
      curl
        -X POST 
        -d 'email=lora17@yml.fr'
        -d 'password=kona75mi:-)'
        http://localhost:3000/users/is_registered
    */

    users.findOne(
      {"email" : req.body.email},
      (err, client)=>{
        if(bcrypt.compareSync(req.body.password, client.hashed_password)){
          res.send("registerd");
        }else{
          res.send("not_registerd");
        }
      }
    )

  });

  // just for test in dev mode
  app.get('/drop_db', (req, res) => {
    users.drop();
    res.send("drop_db");
  });

  app.listen(3000, () => {
    console.log("En attente de requêtes...");
  });
})
.catch(function (err) {
  throw err;
});