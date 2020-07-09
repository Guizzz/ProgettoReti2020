var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");
const NodeCouchdb = require('node-couchdb');
var nano = require('nano')('http://admin:Reti2020@localhost:5984');
const db_viaggi = nano.use('citta');


router.get("/get_coords/:citta", async function(req, res, next){
  var url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+req.params.citta+'&inputtype=textquery&fields=photos,geometry&key=AIzaSyAx4VHsf6GzeojgnmiZna1ttmRLD1bX_UA'
  const f_res = await fetch(url);
  const json = await f_res.json().then((x)=>res.send(x.candidates[0].geometry.location)).catch((err)=>res.send(err));
});

router.get("/get_travel/:email", function(req, res, next){
    //console.log(req.cookies['username']);
    const q = {
      selector: {
        email: req.params.email,

      },
      fields: [ "citta","email","date"],
      limit:50
    };
    db_viaggi.find(q).then((body) => {
      var num = body.docs.length;
      var data = [];
      for(var i = 0; i < num; i++){
        if(body.docs[i].date != null)
          data.push({citta: body.docs[i].citta,
            date: body.docs[i].date});
      }
      console.log(data);
      res.send({data: data});
    }).catch((x)=>res.send(x));
});

router.get("/get_wish/:email", function(req, res, next){
    //console.log(req.cookies['username']);
    const q = {
      selector: {
        // email: { "$eq": req.cookies['username']},
        email: req.params.email,

      },
      fields: [ "citta","email","date"],
      limit:50
    };
    db_viaggi.find(q).then((body) => {
      var num = body.docs.length;
      var data = [];
      for(var i = 0; i < num; i++){
        if(body.docs[i].date == null)
          data.push({citta: body.docs[i].citta});
      }
      console.log(data);
      res.send({data: data});
    }).catch((x)=>res.catch(x));
});

module.exports = router;
