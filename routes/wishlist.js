var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");
const NodeCouchdb = require('node-couchdb');

const couch = new NodeCouchdb({
auth:{
user: 'admin',
password: 'Reti2020'
}
});

const dbName = "citta";
const viewUrl = "_design/citta/_view/cities";
var todo = 0;
var completed = 0;
// couch.listDatabases().then(function(dbs){
//   console.log(dbs);
// });


/* GET home page. */
router.get('/', function(req, res, next) {
  couch.get(dbName, viewUrl).then(({data, headers, status}) => {
    // console.log(data.rows[0].key);
    if(data.total_rows != 0){
      res.render('wishlist', {name: data.rows, todo: todo, completed: completed});
    }
    else
        res.render('wishlist', {name: [], todo: todo, completed: completed});
  }, err => {
    console.log(err);
  });
});

router.delete('/del_wish/', function(req, res, next) {
  todo -=1;
  var id = req.body.id;
  var rev = req.body.rev;
  console.log(id);
  couch.del(dbName, id, rev).then(({data, headers, status}) => {
    console.log("eliminato documento di id: "+id);
  }, err => {
    console.log(err);
  });
});

router.put('/update_wish/', async function(req, res, next) {
  todo -= 1;
  completed +=1;
  var id = req.body.id;
  var rev = req.body.rev;
  var d = new Date();
  const url_pos = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+id+'&inputtype=textquery&fields=photos,geometry&key=AIzaSyAx4VHsf6GzeojgnmiZna1ttmRLD1bX_UA';
  const f_res = await fetch(url_pos);
  const json = await f_res.json();
  var lat = json.candidates[0].geometry.location.lat;
  var lng = json.candidates[0].geometry.location.lng;
  var date = ""+d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()
  console.log(id);
  couch.update(dbName, {
    _id: id,
    _rev: rev,
    lat: lat,
    lng: lng,
    date: date
  }).then(({data, headers, status}) => {
    console.log("aggiornato elemento: "+id);
  }, err => {
    console.log(err);
  });
});

router.post("/add_wish/", async function(req, res){
  todo+=1;
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
    const id = name;
    const obj = {
    _id: id,
    date: null,
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

module.exports = router;
