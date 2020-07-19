var express = require('express');
var router = express.Router();
var serv = require('../private/servizi.js');
const fetch = require("node-fetch");
const NodeCouchdb = require('node-couchdb');
require('dotenv').config();
var nano = require('nano')('http://'+process.env.USR+':'+process.env.PSW+'@localhost:5984');
const db_viaggi = nano.use('citta');


router.get("/get_coords/:citta", function(req, res, next){
  serv.getCoords(req.params.citta).then((x)=>res.send(x)).catch((err)=>res.sendStatus(404));
});

router.get("/get_travel/:email", function(req, res, next){
    //console.log(req.cookies['username']);
    var user = req.params.email;
    var fields = [ "citta","email","date"];
    serv.find(user, fields).then((body) => {
      var num = body.docs.length;
      if(num>0){
      var data = [];
      for(var i = 0; i < num; i++){
        if(body.docs[i].date != null)
          data.push({citta: body.docs[i].citta,
            date: body.docs[i].date});
      }
      console.log(data);
      res.send({data: data});
      }
      else{
        res.sendStatus(404);
      }
    }).catch((x)=>res.send(x));
});

router.get("/get_wish/:email", function(req, res, next){
    //console.log(req.cookies['username']);
    var user = req.params.email;
    var fields = [ "citta","email","date"];
    serv.find(user, fields).then((body) => {
      var num = body.docs.length;
      console.log(num);
      if(num>0){
        
      
      var data = [];
      for(var i = 0; i < num; i++){
        if(body.docs[i].date == null)
          data.push({citta: body.docs[i].citta});
      }
  
      console.log(data);
    
      res.send({data: data});
    }
    else{
      res.sendStatus(404);
    }
    }).catch((x)=>res.catch(x));
});

router.get("/get_url/:citta",async function(req,res){
  const url_pos = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+req.params.citta+'&inputtype=textquery&fields=photos,geometry&key='+process.env.API;
  const f_res = await fetch(url_pos);
  const json =  f_res.json().then(async function(x){

  
        console.log(x);
        if(x.status=='OK' && x.candidates[0].photos!=null){
  
              const foto_ref = x.candidates[0].photos[0].photo_reference;
              const url_foto = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="+foto_ref+"&key="+process.env.API;
              const f_foto = await fetch(url_foto);
              const url = f_foto.url;
              res.send(url);
        }
        else{
          res.sendStatus(404);
        }
 });
  
});
module.exports = router;
