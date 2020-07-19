var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");
const NodeCouchdb = require('node-couchdb');
const dbName = "citta";
var serv = require('../private/servizi.js');
const viewUrl = "_design/citta/_view/cities";
require('dotenv').config();
var nano = require('nano')('http://'+process.env.USR+':'+process.env.PSW+'@localhost:5984');
const db_viaggi = nano.use('citta');

const couch = new NodeCouchdb({
auth:{
user: 'admin',
password: 'biar'
}
});

router.get('/', function(req, res, next) {
  var user = req.cookies['username'];
  if(user){
    console.log(user);
    var fields = ["_id","citta","lat","lng","email","date","_rev"];
    serv.find(user, fields).then((body) => {
      console.log(body.docs.length);
      var num= body.docs.length
      if(num!=0){
        console.log("Sono nell'if");
        res.render('viaggi', {name: body.docs, API: process.env.API,cookie: req.cookies['username']});
      }
      else
        res.render('viaggi', {name: [], API: process.env.API,cookie: req.cookies['username']});
    });
  }
  else {
    //res.send("<a href= 'http://localhost:3000/login '>Accedi</a> o <a href= 'http://localhost:3000/registrazione'> Registrati</a>  per visualizzare i tuoi i viaggi")
    res.redirect("/registrazione");
  }
});

router.get('/positions', function(req, res) {
  //console.log(req.cookies['username']);
  var fields = [ "citta","lat","lng","email","date",];
  var user = req.cookies['username'];
  serv.find(user,fields).then((body) => {
    console.log(body.docs.length);
    var num= body.docs.length
    if(num!=0){
      res.send({data: body.docs});
      console.log({data: body.docs});
    }
  });


 /* couch.get(dbName, viewUrl).then(({data, headers, status}) => {
    if(data.total_rows != 0){
        res.send({data: data.rows});
      }
  }, err => {
    console.log(err);
    res.end();
  });*/
});


router.post("/add_travel/", async function(req, res){
  const name = req.body.citta;
  const url_pos = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+name+'&inputtype=textquery&fields=photos,geometry&key='+process.env.API;
  const f_res = await fetch(url_pos).catch((x)=>{res.send(x)});
  const json = await f_res.json();
  var d = new Date();
  
 if(json.candidates[0]==null){
   res.redirect('/error');

 }
 else{
  var lat = json.candidates[0].geometry.location.lat;
  var lng = json.candidates[0].geometry.location.lng;
  var email= req.cookies['username'];
  couch.uniqid().then(function(){
    
    const obj = {
    citta: name,
    date: ""+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear(),
    lat: lat,
    lng: lng,
    email: email
  }
  serv.addTravel(obj).then(({data, headers, status}) => {
      console.log("");
      res.redirect("/viaggi");
      res.end();
  }, err => {
      console.log(err);
      res.redirect("/error");
    });
  });
 }
});


router.delete("/del_viaggio",function(req,res){
  var id = req.body.id;
  var rev = req.body.rev;
  console.log(id);
  console.log(rev);
  serv.deleteTravel(id, rev).then((body) => {
    console.log(body);
    res.redirect(303,"http://localhost:3000/viaggi");
  });
});

module.exports = router;
