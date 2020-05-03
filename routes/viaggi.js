var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");
const NodeCouchdb = require('node-couchdb');
const dbName = "citta";
const viewUrl = "_design/citta/_view/cities";

const couch = new NodeCouchdb({
auth:{
user: 'admin',
password: 'Reti2020'
}
});

router.get('/', function(req, res, next) {
  couch.get(dbName, viewUrl).then(({data, headers, status}) => {
    if(data.total_rows != 0)
      res.render('viaggi', {name: data.rows, API: "AIzaSyAx4VHsf6GzeojgnmiZna1ttmRLD1bX_UA"});
    else
        res.render('viaggi', {name: [], API: "AIzaSyAx4VHsf6GzeojgnmiZna1ttmRLD1bX_UA"});
  }, err => {
    console.log(err);
  });
});

router.get('/positions', function(req, res) {
  console.log("sono qui");
  couch.get(dbName, viewUrl).then(({data, headers, status}) => {
    if(data.total_rows != 0){
        res.send({data: data.rows});
      }
  }, err => {
    console.log(err);
    res.end();
  });
});


router.post("/add_travel/", async function(req, res){
  const name = req.body.citta;
  const url_pos = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+name+'&inputtype=textquery&fields=photos,geometry&key=AIzaSyAx4VHsf6GzeojgnmiZna1ttmRLD1bX_UA';
  const f_res = await fetch(url_pos);
  const json = await f_res.json();
  // const foto_ref = json.candidates[0].photos[0].photo_reference;
  // const url_foto = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="+foto_ref+"&key=AIzaSyAx4VHsf6GzeojgnmiZna1ttmRLD1bX_UA";
  // const f_foto = await fetch(url_foto);
  // const url = f_foto.url;
  var lat = json.candidates[0].geometry.location.lat;
  var lng = json.candidates[0].geometry.location.lng;

  couch.uniqid().then(function(){
    const id = name;
    const obj = {
    _id: id,
    date: 1,
    lat: lat,
    lng: lng
  }
  couch.insert(dbName, obj).then(({data, headers, status}) => {
      console.log("");
      res.redirect("/viaggi");
      res.end();
  }, err => {
      console.log(err);
      res.redirect("/error");
    });
  });
});
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('viaggi', {API: "AIzaSyAx4VHsf6GzeojgnmiZna1ttmRLD1bX_UA"});
// });

module.exports = router;
