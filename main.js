const http = require("http");
const host = 'localhost';
const port = 4000;

const express = require('express');
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const session = require('express-session');
const convert = require('xml-js');
const fs = require('fs');

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

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' })
    fs.createReadStream('index.html').pipe(res)
  })

  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

app.get("/login",(req,res)=> {
  res.render("main",data)
});

app.post("/login",(req,res)=> {
  console.log("ici");
  randomBulbi();
});
