var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");
const NodeCouchdb = require('node-couchdb');
const dbName = "citta";
const viewUrl = "_design/citta/_view/cities";
var nano = require('nano')('http://admin:biar@localhost:5984');
const db_viaggi = nano.use('citta');

const couch = new NodeCouchdb({
auth:{
user: 'admin',
password: 'biar'
}
});

router.get('/', function(req, res, next) {
  if(req.cookies['username']){
        console.log(req.cookies['username']);
        const q = {
          selector: {
            email: { "$eq": req.cookies['username']},
           
          },
          fields: ["_id","citta","lat","lng","email","date","_rev"],
          limit:50
        };
        db_viaggi.find(q).then((body) => {
          console.log(body.docs.length);
          var num= body.docs.length
          if(num!=0){
          console.log("Sono nell'if");
          res.render('viaggi', {name: body.docs, API: "AIzaSyAx4VHsf6GzeojgnmiZna1ttmRLD1bX_UA",cookie: req.cookies['username']});
          }
        else
            res.render('viaggi', {name: [], API: "AIzaSyAx4VHsf6GzeojgnmiZna1ttmRLD1bX_UA",cookie: req.cookies['username']});
      
        });
}
  else {
    res.send("<a href= 'http://localhost:3000/login '>Accedi</a> o <a href= 'http://localhost:3000/registrazione'> Registrati</a>  per visualizzare i tuoi i viaggi")
  }
});

router.get('/positions', function(req, res) {
  console.log("sono qui");
  console.log(req.cookies['username']);
        const q = {
          selector: {
            email: { "$eq": req.cookies['username']},
           
          },
          fields: [ "citta","lat","lng","email","date",],
          limit:50
        };
        db_viaggi.find(q).then((body) => {
          console.log(body.docs.length);
          var num= body.docs.length
          if(num!=0){
            res.send({data: body.docs});
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
  const url_pos = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+name+'&inputtype=textquery&fields=photos,geometry&key=AIzaSyAx4VHsf6GzeojgnmiZna1ttmRLD1bX_UA';
  const f_res = await fetch(url_pos);
  const json = await f_res.json();
  // const foto_ref = json.candidates[0].photos[0].photo_reference;
  // const url_foto = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="+foto_ref+"&key=AIzaSyAx4VHsf6GzeojgnmiZna1ttmRLD1bX_UA";
  // const f_foto = await fetch(url_foto);
  // const url = f_foto.url;
  var lat = json.candidates[0].geometry.location.lat;
  var lng = json.candidates[0].geometry.location.lng;
  var email= req.cookies['username'];
  couch.uniqid().then(function(){
    const id = name;
    const obj = {
    citta: name,
    date: 1,
    lat: lat,
    lng: lng,
    email: email
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

router.delete("/del_viaggio",function(req,res){
  var id = req.body.id;
    var rev = req.body.rev;
    console.log(id);
    console.log(rev);
    db_viaggi.destroy(id,rev).then((body) => {
      console.log(body);
     res.redirect(303,"http://localhost:3000/viaggi");
    }); 
    ;
     
});

module.exports = router;
