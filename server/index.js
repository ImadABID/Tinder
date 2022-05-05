const express = require("express");
const app = express();

const bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');
var token_sig = 'pjezfpjajfajeipjfez4845as5';

// --- /Multer ----

const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './images');
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

// --- find port lib ---
var fp = require("find-free-port");


// const upload = multer({ storage });
const upload = multer({ dest: 'uploads/' });

var WebSocketServer = require('ws').Server;
var tab_wss = [];

// --- Multer\ ----

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const cors = require("cors");
const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions)) // Use this after the variable declaration

var fs = require('fs');
const console = require("console");
const { isWindows } = require("nodemon/lib/utils");

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017';

// On ouvre une connexion à notre base de données
MongoClient.connect(url)
  // On commence par récupérer la collection que l'on va utiliser et la passer
  .then(function (client) {
    return client.db("tinderb");
  })
  .then((db) => {

    // Rajouter vos routes et les traitements
    // just for test in dev mode
    app.get('/welcome', (req, res) => {
      console.log('welcome')
      res.json({ respond: "Hello_World" });
    });

    app.post('/socket', (req, res) => {

      const get_web_socket_by_email = (email_in)=>{
        for(i in tab_wss){
          if(tab_wss.email == email_in){
            return {wss : tab_wss.wss, index : i};
          }
        }
        return {wss : null, index : -1};
      }

      jwt.verify(req.body.token, token_sig, (err, user) => {
        


        let wss;
        
        // socket already opened
        let existing_socket = get_web_socket_by_email(user.email);
        if(existing_socket.index != -1){
          tab_wss.splice(existing_socket.index, 1);
        }

        // dynamic port allocation
        fp(1044, (err, port)=>{

          wss = new WebSocketServer({ port: port });

          wss.on('connection', (socket)=>{

            console.log('allocating port : '+port);
            
            socket.on('message', (msg)=>{

              const msg_json = JSON.parse(msg);
              console.log(msg_json);

              // send ack
              wss.clients.forEach((client)=>{
                if(client.readyState == 1){
                  client.send(JSON.stringify({msg_json}));
                }
              });

              // add to db

              // forward
              let receiver = get_web_socket_by_email(msg_json.receiverEmail);
              if(receiver.wss != null){
                receiverwss.clients.forEach((client)=>{
                  if(client.readyState == 1){
                    client.send(JSON.stringify({msg_json}));
                  }
                });
              }

            });
          
          });

          tab_wss.push(wss);

          res.json({ respond: {port : port, messages_list : []} });

        });
        
      });

    });

    app.post('/chat/contact_list',(req, res)=>{

      const find_contact_profile = (email) => {
        return new Promise(
          (resolve, email) => {

            db.collection("users").findOne(
              { email: email },
              (err, profile) => {
                resolve(profile);
              }
            );
          }
        )
      }


      jwt.verify(req.body.token, token_sig, (err, user) => {

        db.collection("chat").find({}).toArray(async (err, msgs) => {

          let profiles = [];
          let profileEmails = [];

          let profile;
          let profile_email;


          for (msg_i in msgs) {

            if (msgs[msg_i].senderEmail === user.email || msgs[msg_i].receiverEmail === user.email) {

              if(msgs[msg_i].senderEmail === user.email){
                profile_email = msgs[msg_i].receiverEmail;
              }else{
                profile_email = msgs[msg_i].senderEmail;
              }

              if(!profileEmails.includes(profile_email)){

                profile = await find_contact_profile(profile_email);

                profileEmails.push(profile_email);
                profiles.push(profile);

              }

            }

          }

          res.json({ contactProfiles: profiles });

        })

      });

    })


    app.post('/matches/get', (req, res) => {

      /*
        curl
          -X POST 
          -d 'token=lora17@yml.fr'
          http://localhost:3000/users/profile
      */

      const find_matcher = (email_in) => {
        return new Promise(
          (resolve, email) => {

            db.collection("users").findOne(
              { email: email_in },
              (err, matcher_profile) => {
                resolve(matcher_profile);
              }
            );
          }
        )
      }


      jwt.verify(req.body.token, token_sig, (err, user) => {

        db.collection("matches").find({}).toArray(async (err, matches) => {

          let data = [];
          let matcher;

          for (match_i in matches) {

            if (matches[match_i].email_1 === user.email) {

              for (mutual_match_i in matches) {
                if (
                  matches[mutual_match_i].email_2 === user.email &&
                  matches[mutual_match_i].email_1 === matches[match_i].email_2
                ) {

                  matcher = await find_matcher(matches[match_i].email_2);
                  data.push(matcher);

                  break;

                }

              }

            }

          }

          res.json({ matchers: data });

        })

      });

    });


    app.post('/matches/set', (req, res) => {

      /*
        curl
          -X POST 
          -d 'token=lora17@yml.fr'
          http://localhost:3000/users/profile
      */

      /*jwt.verify(req.body.token, token_sig, (err, user)=>{
        
        db.collection("matches").findOne(
          {"email_1" : user.email},
          (err, client)=>{
            console.log(client)
          }
        )
        
      })*/

      jwt.verify(req.body.token, token_sig, (err, user) => {

        var myobj = { 'email_1': user.email, 'email_2': req.body.email, 'action': req.body.action };
        db.collection("matches").insertOne(myobj, function (err, res) {
          if (err) throw err;
          console.log("1 element inserted");

        });

      })



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

      jwt.verify(req.body.token, token_sig, (err, user) => {

        db.collection("users").findOne(
          { "email": user.email },
          (err, client) => {

            if (
              !client.hasOwnProperty('username') ||
              !client.hasOwnProperty('age') ||
              !client.hasOwnProperty('description') ||
              !client.hasOwnProperty('passion') ||
              !client.hasOwnProperty('orientation') ||
              !client.hasOwnProperty('targetedSex')
            ) {

              res.json(
                {
                  msg: 'some profile info are missing.'
                }
              );


            } else {

              db.collection("users").updateOne(
                { "email": user.email }, // Filter
                {
                  $set: {
                    "latitude": req.body.latitude,
                    "longitude": req.body.longitude
                  }
                },
              )
                .then((obj) => {

                  //db.collection("matches").deleteMany({});
                  db.collection("users").find({}).toArray(function (err, matches) {
                    db.collection("matches").find({}).toArray(function (err, matcher) {

                      let data = {};
                      let dist;
                      let i = 0;
                      let test;
                      for (let attr in matches) {

                        if (matches[attr].email == user.email) {
                          continue;
                        }

                        if (
                          !matches[attr].hasOwnProperty('username') ||
                          !matches[attr].hasOwnProperty('age') ||
                          !matches[attr].hasOwnProperty('description') ||
                          !matches[attr].hasOwnProperty('passion') ||
                          !matches[attr].hasOwnProperty('orientation') ||
                          !matches[attr].hasOwnProperty('targetedSex')
                        ) {
                          continue;
                        }

                        test = 0;
                        for (let ind in matcher) {
                          if (
                            user.email === matcher[ind].email_1 && matches[attr].email === matcher[ind].email_2
                          ) {
                            test = 1;
                            break;
                          }
                        }

                        if (
                          test === 0 &&
                          getDistance(req.body.latitude, req.body.longitude, matches[attr].latitude, matches[attr].longitude) < 10
                        ) {
                          dist = { distance: getDistance(req.body.latitude, req.body.longitude, matches[attr].latitude, matches[attr].longitude) }
                          data[i] = Object.assign(matches[attr], dist);
                          i++;
                        }

                        if (i > 20) {
                          break;
                        }

                      }

                      const jsonAsArray = Object.keys(data).map(function (key) {
                        return data[key];
                      })
                        .sort(function (itemA, itemB) {
                          return itemA.distance < itemB.distance;
                        });

                      res.json(
                        {
                          msg: '0',
                          jsonAsArray: jsonAsArray
                        }
                      );

                    });
                  });

                })
                .catch((err) => {
                  console.log('Error: ' + err);
                })

            }

          }
        )

      })
    });



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
      db.collection("users").findOne(
        { "email": req.body.email },
        (err, cl) => {
          if (cl) {
            res.json({ msg: 'email already used' });
          } else {

            db.collection("users").insertOne(client, (insertOne_err, insertOne_res) => {
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

      db.collection("users").findOne(
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

      db.collection("users").findOne(
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

        db.collection("users").findOne(
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

    app.post('/users/profile/visit', (req, res) => {

      /*
        curl
          -X POST 
          -d 'token=lora17@yml.fr'
          http://localhost:3000/users/profile
      */

      jwt.verify(req.body.token, token_sig, (err, user) => {

        db.collection("users").findOne(
          { "email": req.body.email },
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

    app.post('/profile/update', (req, res) => {

      jwt.verify(req.body.token, token_sig, (err, user) => {

        let client = {};

        client.username = req.body.username;
        client.age = req.body.age;
        client.description = req.body.description;
        client.passion = req.body.passion;
        client.orientation = req.body.orientation;
        client.targetedSex = req.body.targetedSex;

        db.collection("users").updateOne({ email: user.email }, { $set: client }, { upsert: true });

        res.json(
          {
            msg: '0'
          }
        );

      })

    });


    app.post('/upload_image', upload.single('photo'), (req, res) => {

      jwt.verify(req.body.token, token_sig, (err, user) => {

        to_add = {};

        switch (req.body.imageRole) {

          case 'profileImage':
            to_add.profileImage = req.file.filename;
            break;

          case 'image1':
            to_add.image1 = req.file.filename;
            break;

          case 'image2':
            to_add.image2 = req.file.filename;
            break;

          case 'image3':
            to_add.image3 = req.file.filename;
            break;

          case 'image4':
            to_add.image4 = req.file.filename;
            break;

          case 'image5':
            to_add.image5 = req.file.filename;
            break;

          default:
            res.json(
              {
                msg: 'imageRole not known. image ignored.'
              }
            );

        }

        db.collection("users").updateOne({ email: user.email }, { $set: to_add }, { upsert: true });

        res.json(
          {
            msg: '0'
          }
        );

      })

    });

    app.post('/delete_image', (req, res) => {

      jwt.verify(req.body.token, token_sig, (err, user) => {

        db.collection("users").findOne(
          { "email": user.email },
          (err, client) => {

            switch (req.body.imageRole) {

              case 'profileImage':

                fs.unlink(__dirname + '/uploads/' + client.profileImage,
                  () => {
                    db.collection("users").updateOne({ email: user.email }, { $unset: { profileImage: '' } });
                  }
                );
                break;

              case 'image1':

                fs.unlink(__dirname + '/uploads/' + client.image1,
                  () => {
                    db.collection("users").updateOne({ email: user.email }, { $unset: { image1: '' } });
                  }
                );
                break;

              case 'image2':

                fs.unlink(__dirname + '/uploads/' + client.image2,
                  () => {
                    db.collection("users").updateOne({ email: user.email }, { $unset: { image2: '' } });
                  }
                );
                break;

              case 'image3':

                fs.unlink(__dirname + '/uploads/' + client.image3,
                  () => {
                    db.collection("users").updateOne({ email: user.email }, { $unset: { image3: '' } });
                  }
                );
                break;

              case 'image4':

                fs.unlink(__dirname + '/uploads/' + client.image4,
                  () => {
                    db.collection("users").updateOne({ email: user.email }, { $unset: { image4: '' } });
                  }
                );
                break;

              case 'image5':

                fs.unlink(__dirname + '/uploads/' + client.image5,
                  () => {
                    db.collection("users").updateOne({ email: user.email }, { $unset: { image5: '' } });
                  }
                );
                break;

              default:
                res.json(
                  {
                    msg: 'imageRole not known. operation ignored.'
                  }
                );

            }

            res.json(
              {
                msg: '0'
              }
            );

          }
        )

      })

    });

    app.get('/get_image', (req, res) => {
      res.sendFile('uploads/' + req.query.filename, { root: __dirname });
    })

    // just for test in dev mode
    app.get('/drop_db', (req, res) => {
      db.collection('users').drop();
      db.collection('matches').drop();
      res.send("drop_db");
    });

    app.listen(3000, () => {
      console.log("En attente de requêtes...");
    });

  })
  .catch(function (err) {
    throw err;
  });