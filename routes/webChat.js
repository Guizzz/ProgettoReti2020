var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");
const NodeCouchdb = require('node-couchdb');
require('dotenv').config();
var nano = require('nano')('http://'+process.env.USR+':'+process.env.PSW+'@localhost:5984');

const db_viaggi = nano.use('citta');
const couch = new NodeCouchdb({
auth:{
user: 'admin',
password: 'Reti2020'
}
});

const dbName = "citta";
const viewUrl = "_design/citta/_view/cities";

// couch.listDatabases().then(function(dbs){
//   console.log(dbs);
// });


/* GET home page. */
router.get('/', function(req, res, next)
{


  if(req.cookies['username'])
  {
    //console.log("webChat:" + req.cookies['username']);
    const q = {
      selector:
      {
        email: { "$eq": req.cookies['username']},
      },
      fields: [ "citta","email","date","_rev","_id","foto"],
      limit:50
    };

    res.render('chat', {cookie: req.cookies['username'],});
  }
  else {
    res.render('login');
  }

});
/*
router.delete('/del_wish/', function(req, res, next) {

  var id = req.body.id;
  var rev = req.body.rev;
  console.log(id);
  db_viaggi.destroy(id,rev).then((body) => {
    console.log(body);
    res.redirect(303,"http://localhost:3000/wishlist");
  });
});

router.put('/update_wish/', async function(req, res, next) {

  var citta = req.body.citta;
  var rev = req.body.rev;
  var id = req.body.id;
  var d = new Date();
  const url_pos = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+citta+'&inputtype=textquery&fields=photos,geometry&key=AIzaSyAx4VHsf6GzeojgnmiZna1ttmRLD1bX_UA';
  const f_res = await fetch(url_pos);
  const json = await f_res.json();
  var lat = json.candidates[0].geometry.location.lat;
  var lng = json.candidates[0].geometry.location.lng;
  var date = ""+d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()
  console.log("La città è: "+citta);
  console.log(id);
  console.log(rev);
  couch.update(dbName, {
    citta:citta,
    lat: lat,
    lng: lng,
    date: date,
    email: req.cookies['username'],
    _id: id,
    _rev:rev

  }).then(({data, headers, status}) => {
    console.log("aggiornato elemento: "+citta);
    res.redirect(303,"http://localhost:3000/wishlist");
  }, err => {
    console.log(err);
  });
});

router.post("/add_wish/", async function(req, res){

  const name = req.body.citta;
  // const url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+name+'&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyAx4VHsf6GzeojgnmiZna1ttmRLD1bX_UA';
  const url_pos = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+name+'&inputtype=textquery&fields=photos,geometry&key=AIzaSyAx4VHsf6GzeojgnmiZna1ttmRLD1bX_UA';
  const f_res = await fetch(url_pos);
  const json = await f_res.json();
  const foto_ref = json.candidates[0].photos[0].photo_reference;
  const url_foto = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="+foto_ref+"&key=AIzaSyAx4VHsf6GzeojgnmiZna1ttmRLD1bX_UA";
  const f_foto = await fetch(url_foto);
  const url = f_foto.url;
  // var lat = json.candidates[0].geometry.location.lat;
  // var lng = json.candidates[0].geometry.location.lng;

  couch.uniqid().then(function(){

    const obj = {


    citta: name,
    date: null,
    email: req.cookies['username'],
    // lat: lat,
    // lng: lng,
    foto: url
  }
  couch.insert(dbName, obj).then(({data, headers, status}) => {
      console.log("");
      res.redirect("/wishlist");
      res.end();
  }, err => {
      console.log(err);
      res.redirect("/error");
    });
  });

  // var ris = res.json(json_foto);
  // res.json(obj);
  // res.end();
});
*/
module.exports = router;