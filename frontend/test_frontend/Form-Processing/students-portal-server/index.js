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


function validateFName(fname) {
    let errors = [];
    if (fname.length == 0) {
        errors.push("First Name Is Null");
    }

    if (fname.length > 50) {
        errors.push("First Name Length Can Not Exceed 50 Characters.");
    }

    return errors;
}

function validateLName(lname) {
    let errors = [];
    if (lname.length == 0) {
        errors.push("Last Name Is Null");
    }

    if (lname.length > 50) {
        errors.push("Last Name Length Can Not Exceed 50 Characters.");
    }

    return errors;
}

function validateBirthDate(date) {
    let errors = [];
    if (date === undefined || date === "") {
        errors.push("Birth Date is Null");
    }

    return errors;
}

function validateContactNo(contactno) {
    let errors = [];

    // check whether contact no is empty or not
    if (contactno.length == 0) {
        errors.push("Contact Number Is Null");
    }

    // cheaks whether contact no length is less then 10 character
    if (contactno.length < 10) {
        errors.push("Contact Number Must Be Of 10 Digits");
    }

    // checks whether contact no length is more then 10 character
    if (contactno.length > 10) {
        errors.push("Contact No Must Be of 10 Digits");
    }

    // Using regular expression check whether contactno is only containing digits or not
    if (!(/[0-9]/g.test(contactno))) {
        errors.push("Contact Number Must Contain Digits Only");
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

function validateSemester(semester) {
    let errors = [];
    if (semester.length == 0) {
        errors.push("Semester Is Null");
    }

    if (semester > 8) {
        errors.push("Invalid Semester");
    }

    return errors;
}

function validateCourse(course) {
    let errors = [];
    if (course !== "B.Tech Computer Engineering" && course !== "B.Tech Information Technology") {
        errors.push("Invalid Course");
    }
    return errors;
}


app.post("/api/student", async(req, res) => {
    console.log("Requesey..	");
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let contactno = req.body.contactno;
    let birthdate = req.body.birthdate;
    let semester = req.body.semester;
    let course = req.body.course;

    let errFName = validateFName(fname); // will validate first name
    let errLName = validateLName(lname); // will validate last name
    let errEmail = validateEmail(email); // will validate email
    let errContactNo = validateContactNo(contactno); // will validate contact no
    let errBirthDate = validateBirthDate(birthdate); // will validate birthdate
    let errSemester = validateSemester(semester); // will validate semester
    let errCourse = validateCourse(course); // will validate course

    if (errFName.length || errLName.length || errEmail.length || errContactNo.length || errBirthDate.length || errSemester.length || errCourse.length) {
        res.status(200).json({
            msg: "Validation Failed",
            errors: {
                fname: errFName,
                lname: errLName,
                email: errEmail,
                contactno: errContactNo,
                birthdate: errBirthDate,
                semester: errSemester,
                course: errCourse
            }
        });
    }
    else {
        console.log("We add a new user to the database")
        await createUser({ user_name: fname, user_mail: email,user_password:course})
        req.session.logged = true; 
        req.session.register_error = false;  
        res.status(200).send({
            msg: "Student Registered Succesfully",
        })
    }
});


app.get("/api/students", async(req, res) => {
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