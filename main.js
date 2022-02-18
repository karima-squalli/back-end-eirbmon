const express = require('express');
const app = express()
const port = process.env.PORT || 4000;

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const session = require('express-session');
const fs = require('fs');

const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
let users = require('./users.js');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connecté à Mongoose")
  db.collection('users').findOne({}, function (findErr, result) {
    if (findErr) throw findErr;
  });
});



const config = {
  //store: new SQLiteStore,
  secret: 'secret key',
  resave: true,
  rolling: true,
  cookie: {
    maxAge: 1000 * 3600//ms
  },
  saveUninitialized: true
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
app.use(session(config))

//const req = require('express/lib/request');

app.set('views', './Views');
app.set('view engine', 'jade');

function randomBulbi(){
//Constante bulbizarre

var bulb1 = "68ae28"; //Original
var bulb2 = "6B53AB";
var bulb3 = "FF5733";
var bulb4 = "3380FF";
var bulb5 = "DEA325";

var bulbs = [ bulb1, bulb2, bulb3, bulb4, bulb5 ];

var shadow1 = "56931f"; //Original
var shadow2 = "341783";
var shadow3 = "AF3015";
var shadow4 = "0C4FBE";
var shadow5 = "9B6D0B";

var shadows = [ shadow1, shadow2, shadow3, shadow4, shadow5 ];

var eye1 = "d60040"; //Original
var eye2 = "7E652F";
var eye3 = "32AB59";
var eye4 = "53A6AB";
var eye5 = "F263FE";

var eyes = [ eye1, eye2, eye3, eye4, eye5 ];

var spot1 = "006359"; //Original
var spot2 = "F16F37";
var spot3 = "F0EC0E";
var spot4 = "666867";
var spot5 = "FF3418";

var spots = [ spot1, spot2, spot3, spot4, spot5 ];

var claw1 = "ffffff"; //Original
var claw2 = "F7CB4C";
var claw3 = "78F576";
var claw4 = "0F35DF";
var claw5 = "AF2549";

var claws = [ claw1, claw2, claw3, claw4, claw5 ];


// read file
const xmlFile = fs.readFileSync('bulbizarre.svg', 'utf8');

randomindex = Math.floor(Math.random() * 5)
bulbrandom = bulbs[randomindex]

const xmlFile2 = xmlFile.replace(/BULB/gi, bulbrandom)

/*var bulbshadow = parseInt(bulbrandom, 24);
bulbshadow = Math.trunc(bulbshadow / 2);
var shadowrandom = bulbshadow.toString(24);

console.log(bulbshadow);
console.log(shadowrandom);*/

shadowrandom = shadows[randomindex];

const xmlFile3 = xmlFile2.replace(/SHADOW/gi, shadowrandom)
const xmlFile4 = xmlFile3.replace(/EYE/gi, eyes[Math.floor(Math.random() * 5)])
const xmlFile5 = xmlFile4.replace(/SPOT/gi, spots[Math.floor(Math.random() * 5)])
const xmlFile6 = xmlFile5.replace(/CLAW/gi, claws[Math.floor(Math.random() * 5)])

fs.writeFileSync('bulbi.svg',xmlFile6)
}

//Fonction d'appel à la database 

const createUser = async object => {
  const collection = db.collection('users');
  const user = await collection.insertOne(object);
  return user
}


const findUsers = async user_name => {
  const userss = await users.find({})
  userss.map(users => users.user_name);
  return userss
}

app.listen(port, () => {
    console.log(`listening on ${port}`);
});

app.get("/",async (req,res)=> {
  const users = await findUsers()
  const data = {
    users,
    name : req.session.name,
    password : req.session.password,
    logged : req.session.logged,
}
  if (data.logged){
    console.log(req.session.success);
    res.render("home",data)
  }
  else {
    res.redirect("/login");
  }
});

app.get("/login",async(req,res)=> {
  if (req.session.connect_error){
    console.log(req.session.connect_error);
  }
  res.render("login");
});

app.post("/login",async(req,res)=> {
  const userss = await findUsers()
  data = {
    name : req.body.name,
    password : req.body.password,
  }
  let test = false;
  let user_id = 0;
  for (let i = 0; i<userss.length; i++){
      if (userss[i].user_mail ===data.name) {
        console.log(userss[i]);
          test = true
          user_id = i
      }
  }
  for (let i = 0; i<userss.length; i++){
    if (userss[i].user_name ===data.name) {
        test = true
        user_id = i
    }
}
  if (!test){
        req.session.connect_error = "Aucun compte n'est associé à cette adresse mail ou ce nom d'utilisateur.",
        req.session.logged = false
  }
  else{
    test = false
    const good_user = await users.findOne({ $or: [ { user_mail: data.name } , { user_name: data.name } ] })
    if (good_user.user_password === data.password) {
      test = true
    }
    if (!test){
          req.session.connect_error = "Le mot de passe saisi est incorrect.",
          req.session.logged = false
    }
    else{
      req.session.user_id = user_id
        req.session.success = "Vous êtes log"
        req.session.logged =  true
    }
  }
  res.redirect("/")
});

app.get("/register",async(req,res)=> {
  const data = {
    inscription : req.query.register,
  }
  if(req.session.register_error != false) {
    console.log(req.session.register_error)
    res.render("login",data)
  }
  else{
    res.redirect("/")
  }
});

app.post("/register",async(req,res)=> {
  const data = {
    inscription : req.query.register,
    etat : req.query.state,
    name_register : req.body.name_register,
    password_register : req.body.password_register,
    email_register : req.body.email_register,
    password_register_confirm : req.body.password_register_confirm,  
  }
  const username = data.name_register
  const mail = data.email_register
  const password = data.password_register
  const password_confirm = data.password_register_confirm
  //On se connecte automatiquement avec nos identifiants


  if (data.name_register.length > 3 && data.password_register.length > 5 && data.email_register.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i) && data.password_register == data.password_register_confirm){
    const users = await findUsers()
    //On parcourt les pseudos et les pseudos pour voir si ils sont déjà pris
    let test = false
    for (let i = 0; i<users.length; i++){
      if (users[i].user_mail ===data.email_register) {
          test = true
      }
    }
    if (test){
      req.session.register_error = "L'email choisi est déjà pris"
      res.redirect("/register")
      return;
    }
    test = false
    for (let i = 0; i<users.length; i++){
      if (users[i].user_name ===data.name_register) {
          test = true
      }
    }
    if (test){
      req.session.register_error = "Le pseudo choisi est déjà pris"
      res.redirect("/register")
    }
    else {
      await createUser({ user_name: username, user_mail: mail,user_password:password})
      req.session.logged = true; 
      req.session.register_error = false;   
      res.redirect("/register")
    }
  }
  else if (data.name_register.length <= 3){
    req.session.register_error = "Le nom est trop court"
    res.redirect("/register") //Name is too short
  }
  else if (!data.email_register.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i)){
    req.session.register_error = "L'adresse email n'a pas le bon format"
    res.redirect("/register")
  }
  else if (data.password_register.length <= 5){
    req.session.register_error = "Le mot de passe est trop court"
    res.redirect("/register")
  }
  else if (data.password_register != data.password_register_confirm){
    req.session.register_error = "Les mots de passes ne matchent pas"
    res.redirect("/register")
  }
});
