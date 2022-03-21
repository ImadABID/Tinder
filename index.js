const express = require("express");
const app = express();


const bodyParser = require("body-parser");
const { send } = require("process");
app.use(bodyParser.urlencoded({ extended: false }));

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017';

// On ouvre une connexion à notre base de données
MongoClient.connect(url)
// On commence par récupérer la collection que l'on va utiliser et la passer
.then(function (client) {
  console.log("ok");
  return client.db("products_manager").collection("products");
})
.then((products) => {

    // Rajouter vos routes et les traitements

    app.get('/welcome', (req, res)=>{
        res.send("Hello World");
    });

    app.listen(3000, () => {
    console.log("En attente de requêtes...");
    })
})
.catch(function (err) {
  throw err;
});