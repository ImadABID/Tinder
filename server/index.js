const express = require("express");
const app = express();

const bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');
var token_sig = 'pjezfpjajfajeipjfez4845as5';


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const cors = require("cors");
const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
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
    app.get('/welcome', (req, res) => {
      console.log('welcome')
      res.json({ respond: "Hello_World" });
    });


    app.post('/users/setLocalisation', (req, res) => {

      function deg2rad(deg) {
        return deg * (Math.PI / 180)
      }
      function getDistance(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2)
          ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
      }

      /*jwt.verify(req.body.token, token_sig, (err, user)=>{
        
        users.findOne(
          {"email" : user.email},
          (err, client)=>{
            res.json(
              {
                msg:'0',
                client : client
              }
            );
          }
        )
        
      })
      */
      jwt.verify(req.body.token, token_sig, (err, user) => {

        users.updateOne(
          { "email": user.email }, // Filter
          {
            $set: {
              "latitude": req.body.latitude,
              "longitude": req.body.longitude
            }
          },// Update
        )

          .then((obj) => {

            users.find({}).toArray(function (err, matches) {
              let data = {};
              let tmp;
              let dist;
              i = 0;
              for (let attr in matches) {
                if (getDistance(req.body.latitude, req.body.longitude, matches[attr].latitude, matches[attr].longitude) < 10) {

                  dist = { distance: getDistance(req.body.latitude, req.body.longitude, matches[attr].latitude, matches[attr].longitude) }
                  tmp = Object.assign(matches[attr], dist);
                  data[i] = tmp;
                  i++;
                }
              }
              const jsonAsArray = Object.keys(data).map(function (key) {
                return data[key];
              })
                .sort(function (itemA, itemB) {
                  return itemA.distance < itemB.distance;
                });
              res.json({ jsonAsArray })
            });

          })
          .catch((err) => {
            console.log('Error: ' + err);
          })
      })
    });
    /*
    app.post('/users/setLocalisation', (req, res) => {
      users.find({}).toArray(function (err, result) {
          console.log(result);
      });

    });*/



    app.post('/users/register', (req, res) => {

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

      // verify email uniqueness
      users.findOne(
        { "email": req.body.email },
        (err, cl) => {
          if (cl) {
            res.json({ msg: 'email already used' });
          } else {

            users.insertOne(client, (insertOne_err, insertOne_res) => {
              if (insertOne_err) {
                console.log(insertOne_err);
                res.json({ msg: 'Uknown problem' });
              } else {

                let token_ele = {
                  email: client.email
                }
                let token = jwt.sign(token_ele, token_sig);
                res.json({ msg: '0', token: token });

              }
            });

          }
        }
      )

    });


    app.post('/users/login', (req, res) => {

      /*
        curl
          -X POST 
          -d 'email=lora17@yml.fr'
          -d 'password=kona75mi:-)'
          http://localhost:3000/users/login
      */

      console.log('login');

      users.findOne(
        { "email": req.body.email },
        (err, client) => {
          if (client == null) {
            res.json({ msg: 'not registred' });
          } else {

            if (bcrypt.compareSync(req.body.password, client.hashed_password)) {

              let token_ele = {
                email: client.email
              }
              let token = jwt.sign(token_ele, token_sig);
              res.json({ msg: '0', token: token });

            } else {
              res.json({ msg: 'wrong password' });
            }

          }
        }
      )

    });

    // just for test in dev mode
    app.post('/users/is_registered', (req, res) => {

      /*
        curl
          -X POST 
          -d 'email=lora17@yml.fr'
          -d 'password=kona75mi:-)'
          http://localhost:3000/users/is_registered
      */

      users.findOne(
        { "email": req.body.email },
        (err, client) => {
          if (bcrypt.compareSync(req.body.password, client.hashed_password)) {
            res.send("registerd");
          } else {
            res.send("not_registerd");
          }
        }
      )

    });

    app.post('/users/profile', (req, res) => {

      /*
        curl
          -X POST 
          -d 'token=lora17@yml.fr'
          http://localhost:3000/users/profile
      */

      jwt.verify(req.body.token, token_sig, (err, user) => {

        users.findOne(
          { "email": user.email },
          (err, client) => {
            res.json(
              {
                msg: '0',
                client: client
              }
            );
          }
        )

      })


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