const express = require("express");

const app = express()
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const session = require('express-session');

const mongoose = require('mongoose');
let users = require('./users.js');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connecté à Mongoose")
  db.collection('users').findOne({}, function (findErr) {
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
app.use(session(config))

// const req = require('express/lib/request');

// Fonction d'appel à la database 

const createUser = async object => {
  const collection = db.collection('users');
  return await collection.insertOne(object);
}


const findUsers = async user_name => {
  const userss = await users.find({})
  userss.map(users => users.user_name);
  return userss
}



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
    res.redirect("/register");
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
  let data = {
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
  console.log("we re at /register (app.get)")
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
  console.log("we re at /register (app.post)")
  const data = {
    inscription : req.query.register,
    etat : req.query.state,
    name_register : req.body.username,
    password_register : req.body.password,
    email_register : req.body.email,
    password_register_confirm : req.body.cpassword,  
  }
  console.log(data)
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


app.listen(port, () => {
    console.log(`listening on ${port}`);
});