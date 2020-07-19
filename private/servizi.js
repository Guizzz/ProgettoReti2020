var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");
const NodeCouchdb = require('node-couchdb');
require('dotenv').config();
var nano = require('nano')('http://'+process.env.USR+':'+process.env.PSW+'@localhost:5984');
const db_viaggi = nano.use('citta');
const db_utenti = nano.use('utenti');
const couch = new NodeCouchdb({
auth:{
user: 'admin',
password: 'biar'
}
});

module.exports.creaUtente = function(obj){
  return db_utenti.insert({ nome: obj.nome, cognome: obj.cognome, email: obj.email, paese: obj.paese, password: obj.password});
}

module.exports.find = function(user, fields){
  const q = {
    selector: {
      email: { "$eq": user},

    },
    fields: fields,
    limit:50
  };
  return db_viaggi.find(q)
}

module.exports.creaWish = function(obj){
  return couch.insert('citta', obj);
}

module.exports.updateWish = function(id, rev, obj){
  return couch.update('citta', {
    citta:obj.citta,
    lat: obj.lat,
    lng: obj.lng,
    date: obj.date,
    email: obj.email,
    _id: id,
    _rev:rev

  });
}

module.exports.addTravel = function(obj){
  return couch.insert('citta', obj);
}

module.exports.deleteTravel = function(id, rev){
  return db_viaggi.destroy(id,rev);
}

module.exports.getCoords = async function(city){
  var res;
  var url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+city+'&inputtype=textquery&fields=photos,geometry&key='+process.env.API;
  const f_res = await fetch(url);
  const json = await f_res.json().then(function(x){
    if(x.candidates[0]) 
        res=x.candidates[0].geometry.location;
    else 
      res= 404;
  });
  return res;
};

// module.exports.getWish = function(email)
