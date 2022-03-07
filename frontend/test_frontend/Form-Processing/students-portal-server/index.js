const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(express.urlencoded({extended: true}));

app.use(bodyParser.json());

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

app.get("/", (req, res) => {
    res.send("Hello From The Server");
})


function validateUsername(username) {
    let errors = [];
    if (username.length == 0) {
        errors.push("Username Is Null");
    }

    if (username.length > 50) {
        errors.push("Username Length Can Not Exceed 50 Characters.");
    }

    return errors;
}

function validatePasswordconfirm(password,passwordconfirm) {
    let errors = [];
    if (password !== passwordconfirm || passwordconfirm === "") {
        errors.push("password confirmation is different from password");
    }

    return errors;
}

function validatePassword(password) {
    let errors = [];

    // check whether contact no is empty or not
    if (password.length == 0) {
        errors.push("Password Is Null");
    }

    return errors;
}

function validateEmail(email) {
    let errors = [];

    // checks whether email is empty or not
    if (email.length == 0) {
        errors.push("Email Is Null");
    }

    // checks whether email length is more then 100 or not
    if (email.length > 100) {
        errors.push("Email Can not exceed 100 Character");
    }


    // checks whether email is valid or not usinf regular expression
    if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(email))) {
        errors.push("Email Is Not Valid");
    }

    return errors;
}

async function validateRegister(username,email){   
    let errors = [];
    const users = await findUsers()
    //On parcourt les pseudos et les emails pour voir si ils sont déjà pris
    let test = false
    for (let i = 0; i<users.length; i++){
        if (users[i].user_mail ===email) {
            test = true
        }
    }
    if (test){
        errors.push("L'email choisi est déjà pris"); 
    }
    test = false
    for (let i = 0; i<users.length; i++){
        if (users[i].user_name ===username) {
            test = true
        }
    }
    if (test){
        errors.push("Le pseudo choisi est déjà pris");  
    }
    return errors;
}

app.post("/api/register", async(req, res) => {
    console.log("Requesey..	");
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let passwordconfirm = req.body.passwordconfirm;

    let errFUsername = validateUsername(username); // will validate username
    let errEmail = validateEmail(email); // will validate email
    let errPassword = validatePassword(password); // will validate contact no
    let errPasswordconfirm = validatePasswordconfirm(password,passwordconfirm); // will validate passwordconfirm

    //On teste la database
    let errRegister = await validateRegister(username,email); //will validate final registration

    if (errFUsername.length || errEmail.length || errPassword.length || errPasswordconfirm.length || errRegister.length) {
        res.status(200).json({
            msg: "Validation Failed",
            errors: {
                username: errFUsername,
                email: errEmail,
                password: errPassword,
                passwordconfirm: errPasswordconfirm,
                register: errRegister
            }
        });
    }
    else {
        console.log("We add a new user to the database")
        await createUser({ user_name: username, user_mail: email,user_password:password})
        req.session.logged = true; 
        req.session.register_error = false;  
        res.status(200).send({
            msg: "Student Registered Succesfully",
        })
    }
});


app.get("/api/register", async(req, res) => {
    const users = await findUsers()
    console.log(users[1]);
    res.status(200).send({
        msg: "All the data fetched successfully",
        data: users
    })
})

app.listen(3000, () => {
    console.log("Server started ...");
});