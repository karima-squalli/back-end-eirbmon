const express = require('express');
const app = express()
const port = process.env.PORT || 4000;

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const session = require('express-session');
const fs = require('fs');

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

app.listen(port, () => {
    console.log(`listening on ${port}`);
});

app.get("/",(req,res)=> {
  const data = {
    name : req.session.name,
    password : req.session.password,
    user_id : req.session.user_id,
}
  if (data.user_id){
    console.log("on est connecté");
    res.render("home",data)
  }
  else {
    res.redirect("/connect");
  }
});

app.get("/connect",(req,res)=> {
  console.log("Il faut se connecter maintenant");
  res.render("login");
});

app.post("/login",async(req,res)=> {
  const data = {
    name : req.body.name,
    password : req.body.password,
    session : req.session.user_id,
  }
  req.session.user_id =1;
  console.log("ici");
  res.redirect("/")
});

app.get("/register",async(req,res)=> {
  const data = {
    inscription : req.query.register,
    etat : req.query.state,
  }
  if (data.inscription == 1) {
    res.render("login",data)
  }
  if (data.inscription == 0) {
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
  //On se connecte automatiquement avec nos identifiants
  if (data.name_register.length > 3 && data.password_register.length > 5 && data.email_register.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i) && data.password_register == data.password_register_confirm){
    req.session.user_id = 1;    
    res.redirect("/")
  }
  else if (data.name_register.length <= 3){
    res.redirect("/register?register=1&state=1") //Name is too short
  }
  else if (!data.email_register.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i)){
    res.redirect("/register?register=1&state=2")
  }
  else if (data.password_register.length <= 5){
    res.redirect("/register?register=1&state=3")
  }
  else if (data.password_register != data.password_register_confirm){
    res.redirect("/register?register=1&state=4")
  }
});
