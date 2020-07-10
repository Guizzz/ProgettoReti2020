var express = require('express');
var router = express.Router();
var code='';
var flag= true;
var token='';
var id;
const fetch = require("node-fetch");
var db = require('node-couchdb');
var cookie_parser = require('cookie-parser');
router.use(cookie_parser());
var https=require('https');
require('dotenv').config();
var nano = require('nano')('http://'+process.env.USR+':'+process.env.PSW+'@localhost:5984');
var db = nano.use('utenti');
const db_sessioni= nano.use('sessioni');
var mail;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post("/login_utente/", function(req,res,next){

  const email_= req.body.username;
  const password_= req.body.password;
  //console.log("email:" + email_);
  const q =
  {
    selector:
    {
      email: { "$eq": email_}
    },
    fields: [ "email"],
    limit:50
  };

  db_sessioni.find(q).then((body) => {
    if(body.docs.length==1){
      //console.log(body.docs.length);
      res.cookie('username',email_);
      //res.send("Utente già loggato, vai alla <a href='http://localhost:3000'>Home</a>");
      res.redirect("/viaggi");
    }
    else{
      const q1 = {
        selector: {
          email: { "$eq": email_},
          password: {"$eq": password_}
        },
        fields: [ "email"],
        limit:50
      };
      db.find(q).then((body) => {
        if(body.docs.length==1){
          //console.log(body.docs.length);
          db_sessioni.insert({  email : email_}).then((body) => {
            //console.log(body);
            if(body.ok){
              res.cookie('username',email_);
              //res.redirect("http://localhost:3000/viaggi");
              res.redirect("/viaggi");
            }
            else{
              res.render('error');
            }
          });
        }
        else{
          //res.send("Utente non trovato, vai alla <a href='http://localhost:3000/registrazione'>Registrazione</a>");
          res.redirect("/registrazione");
        }
      });
    }
  });
});

router.get("/facebook",function(req,res){
  flag=true;
  res.redirect("https://www.facebook.com/v7.0/dialog/oauth?client_id=545913572776620&redirect_uri=http://localhost:3000/login/code&state={'ciao'}&response_type=code");

});

router.get('/code',function(req,res){
  //res.send('code: '+req.query.code);

  if(flag){
      code= req.query.code;
      res.redirect("http://localhost:3000/login/token");
  }
  else{

     //console.log(token);
     res.redirect("http://localhost:3000/login/token_info");
  }
});

router.get('/token',async function(req,res){
  //res.send("Richiedo il token d'accesso...");

  var client_id="545913572776620";
  var redirect_uri= "http://localhost:3000/login/code";
  var client_secret="9a9a2e02b26b29ff8f735abace483f80";
  flag=false;
  //console.log(flag);
  const fb= await https.get("https://graph.facebook.com/v7.0/oauth/access_token?client_id="+client_id+"&redirect_uri="+redirect_uri+"&client_secret="+client_secret+"&code="+code, async function(res1){
      res1.on('data',async function(chunk){
          //console.log(JSON.parse(chunk));
          token=JSON.parse(chunk).access_token;
          res.redirect("http://localhost:3000/login/code");
      })
  });





});
router.get('/token_info',async function(req,res){

  https.get("https://graph.facebook.com/v7.0/me?access_token="+token,function(res1){
          res1.on('data',function(chunk){
              console.log(JSON.parse(chunk).id);
              id=JSON.parse(chunk).id;
              res.redirect("http://localhost:3000/login/getuser");
          })
  });


});

router.get('/getuser',function(req,res1){
  https.get("https://graph.facebook.com/v7.0/me?fields=email&access_token="+token,function(res){
          res.on('data',function(chunk){
              console.log("Ecco la mail");
              console.log(JSON.parse(chunk));
              mail=JSON.parse(chunk).email;
              res1.cookie('username',mail);
              res1.redirect("http://localhost:3000/login/login_facebook");
          })
  });

  //res.send(req.cookies['username']);
});
router.get('/login_facebook',function(req,res){
  const q = {
    selector: {
      email: { "$eq": req.cookies['username']}


    },
    fields: [ "email"],
    limit:50
  };
  db_sessioni.find(q).then((body) => {
    if(body.docs.length==1){
      console.log(body.docs.length);
      res.send("Utente già loggato, vai alla <a href='http://localhost:3000'>Home</a>");
    }
    else{
      db_sessioni.insert({  email : req.cookies['username']}).then((body) => {
        if(body.ok){
              res.redirect("http://localhost:3000/viaggi");
        }
        else{
              res.render('error');
          }
       });

    }
  });
});

router.get("/logout",function(req,res){
  const q = {
    selector: {
      email: { "$eq": req.cookies['username']}


    },
    fields: [ "_id","_rev"],
    limit:50
  };
  db_sessioni.find(q).then((body) => {
    if(body.docs.length==1){
      console.log(body.docs)
      body.docs.forEach((doc)=>{

      db_sessioni.destroy(doc._id,doc._rev).then((body) => {
        console.log(body);
        res.clearCookie('username');
        res.redirect("/");
      });
    });

    }
    else{
      console.log(body);
      res.redirect('/');
    }


       });


  });



module.exports = router;
