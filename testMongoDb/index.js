const express = require('express')


const session = require('express-session')
const app = express()
const bodyParser = require('body-parser');
const path = require('path');

const port = 5000


// Connection URL
//const url = 'mongodb://127.0.0.1:27017';
//const client = new MongoClient(url);

// Database Name
//const dbName = 'EIRBMON';
let db;

// MongoClient.connect(url, function(err, client) {
//     console.log("Connected successfully to server");
//     db = client.db(dbName);
    
//   });

const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connecté à Mongoose")
});

const sess = {
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


app.use(session(sess))





let users = require('./init.js');
const req = require('express/lib/request');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'jade');

const createUser = async object => {
    const collection = db.collection('users');
    const user = await collection.insertOne(object);
    return user
}


const findUsers = async user_name => {
    const user = await users.find({})
    return user
}



// -------------------------------------------------

// Pour vérifier si l'adresse mail saisie par l'utilisateur
function valid_address(adresse){
    let indice = adresse.indexOf("@gmail.com")
    if (indice !== -1){
        if (indice == adresse.length-10)
            return 1
    }
    else return 0
}

// const newUser = {
//     user_name:username,
//     user_mail:mail,
//     user_password: password
//   }
  
// const insertUser = await createUser(newUser)
// console.log(newUser)


app.get('/', async (req, res) => {

    //console.log('HOLA')
    //const users = db.users.find()
    const users = await findUsers()
    let data = {
        users,
        logged: req.session.logged,
        user: req.session.user
    }
   
    res.render('login', data)
})


app.get('/signup', async (req, res) => {

    const users = await findUsers()
    let data = {
        users,
        signed_up: req.session.signed_up,
        logged: req.session.logged
    }
    
    res.render('signup', data)
})





app.get('/home', async(req, res) => {

    if(!req.session.logged){
        res.redirect(302,'/')
        return
    }
    const users = await findUsers()
    let data = {
        users,
        user: req.session.user,
        logged: req.session.logged
    }

    res.render('home', data)
    //res.render('home', {posted: req.session.posted, identifiants, links, commentaires, logged: req.session.logged, user: req.session.user})
})





app.post('/', async (req, res) => {

    if (!req.session.logged){
        const mail = req.body.mail
        const password = req.body.password

        const users = await findUsers()
        const email = await users.find({}, {user_mail})

        if (mail && password){
            if (!valid_address(mail)) {
                data = {
                    errors: "L'adresse mail saisie n'est pas valide (adresse gmail uniquement).",
                    logged: false
                }
            }
            else if (mail){
                let test = 0;
                for (let i = 0; i<mail.length; i++){
                    if (email[i].user_mail ===mail) {
                        test = 1
                    }
                }
                if (!test){
                    data = {
                    errors: "Aucun compte n'est associé à cette adresse mail.",
                    logged: false
                    }
                }
                else{
                    const passwords = await users.findOne({user_mail: mail})
                    passwords.forEach(element => test = (element.user_password===password))
                    if (!test){
                        data = {
                            errors : "Le mot de passe saisi est incorrect.",
                            logged : false
                        }
                    }
                    else{
                        req.session.logged = true
                        req.session.mail = mail
                        const object_user = db.users.find({user_mail: mail}, {user_name})
                        req.session.user = object_user.user_name
                        data = {
                            success: "Vous êtes log",
                            logged: true,
                        }
                    }
                }
            }
        }
        res.render('login',data)
    }
    else
        res.redirect(302,'/')
})


app.post('/signup', async (req, res) => {

    const username = req.body.username
    const mail = req.body.mail
    const password = req.body.password
    const password_confirm = req.body.password_confirm

    let data = {}

    // insert into identifiants username mail password
    // db.users.insertOne(
    //     { user_name: username, user_password: password, user_mail: mail }
    //  )
    data = {
        success: "Vous êtes inscrit",
        signed_up: true
    }
        res.render('signup',data)

        const newUser = {
            user_name:username,
            user_mail:mail,
            user_password: password
          }
          
        const insertUser = await createUser(newUser)
        console.log(newUser)
})


app.post('/logout',(req, res) => {

    req.session.logged = false
    res.redirect(302,'/')
})



app.post('/home', async(req, res) => {

    if(!req.session.logged){
        res.redirect(302,'/')
        return
    }
    const username = req.session.user
    
    res.render('home', {})
})


// -------------------------------------------------


app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})