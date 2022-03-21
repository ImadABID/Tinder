const express = require("express");
const app = express();

const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

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

    app.get('/welcome', (req, res)=>{
        res.send("Hello World");
    });

    app.post('/users/register', (req, res)=>{
        client = {}

        client.username = req.body.username;
        client.email = req.body.email;
        client.salt = 
        client.hashed_password = bcrypt.hashSync(req.body.password, salt);

        users.insertOne(client, (insertOne_err, insertOne_res)=>{
            res.send("Client registerd !");
        });
    });

    app.listen(3000, () => {
    console.log("En attente de requêtes...");
    })
})
.catch(function (err) {
  throw err;
});