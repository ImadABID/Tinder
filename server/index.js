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

// const upload = multer({ storage });
const upload = multer({ dest: 'uploads/' });

// --- Multer\ ----

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions)) // Use this after the variable declaration

var fs = require('fs');

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
    console.log('welcome')
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

    // verify email uniqueness
    users.findOne(
      {"email" : req.body.email},
      (err, cl)=>{
        if(cl){
          res.json({msg:'email already used'});
        }else{

          users.insertOne(client, (insertOne_err, insertOne_res)=>{
            if(insertOne_err){
              console.log(insertOne_err);
              res.json({msg:'Uknown problem'});
            }else{

              let token_ele = {
                email : client.email
              }
              let token = jwt.sign(token_ele, token_sig);
              res.json({msg:'0', token:token});

            }
          });

        }
      }
    )
  
  });


  app.post('/users/login', (req, res)=>{
    
    /*
      curl
        -X POST 
        -d 'email=lora17@yml.fr'
        -d 'password=kona75mi:-)'
        http://localhost:3000/users/login
    */

    console.log('login');

    users.findOne(
      {"email" : req.body.email},
      (err, client)=>{
        if(client == null){
          res.json({msg:'not registred'});
        }else{

          if(bcrypt.compareSync(req.body.password, client.hashed_password)){
          
            let token_ele = {
              email : client.email
            }
            let token = jwt.sign(token_ele, token_sig);
            res.json({msg:'0', token:token});
            
          }else{
            res.json({msg:'wrong password'});
          }

        }
      }
    )

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

  app.post('/users/profile', (req, res)=>{
    
    /*
      curl
        -X POST 
        -d 'token=lora17@yml.fr'
        http://localhost:3000/users/profile
    */

    jwt.verify(req.body.token, token_sig, (err, user)=>{
      
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

  });

  app.post('/profile/update', (req, res)=>{
    
    jwt.verify(req.body.token, token_sig, (err, user)=>{

      let client = {};

      client.username = req.body.username;
      client.age = req.body.age;
      client.description = req.body.description;
      client.passion = req.body.passion;
      client.orientation = req.body.orientation;
      client.targetedSex = req.body.targetedSex;
      
      users.updateOne({email : user.email}, {$set:client}, {upsert: true});

      res.json(
        {
          msg : '0'
        }
      );

    })

  });


  app.post('/upload_image', upload.single('photo'), (req, res) => {

    jwt.verify(req.body.token, token_sig, (err, user)=>{

      to_add = {};

      switch(req.body.imageRole){

        case 'profileImage':
          to_add.profileImage = req.file.filename;
          break;

        default :
          res.json(
            {
              msg : 'imageRole not known. image ignored.'
            }
          );

      }
      
      users.updateOne({email : user.email}, {$set:to_add}, {upsert: true});

      res.json(
        {
          msg : '0'
        }
      );
      
    })

  });

  app.post('/delete_image', (req, res) => {

    jwt.verify(req.body.token, token_sig, (err, user)=>{

      users.findOne(
        {"email" : user.email},
        (err, client)=>{

          switch(req.body.imageRole){

            case 'profileImage':
    
              fs.unlink(__dirname+'/uploads/'+client.profileImage,
                ()=>{
                  users.updateOne({email : user.email}, {$unset:{profileImage:''}});
                }
              );
              break;
    
            default :
              res.json(
                {
                  msg : 'imageRole not known. operation ignored.'
                }
              );
    
          }
    
          res.json(
            {
              msg : '0'
            }
          );

        }
      )

    })

  });

  app.get('/get_image', (req, res)=>{
    res.sendFile('uploads/'+req.query.filename , {root : __dirname});
  })

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