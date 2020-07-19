var express = require('express');
require('dotenv').config();
var router = express.Router();
var serv = require('../private/servizi.js');

var nano = require('nano')('http://'+process.env.USR+':'+process.env.PSW+'@localhost:5984');
const db = nano.use('utenti');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('registrazione');
});

router.post("/nuovo_utente/", async function(req,res,next){

  const nome_=req.body.nome;
  const cognome_= req.body.cognome;
  const email_= req.body.mail;
  const paese_= req.body.paese;
  const password_= req.body.password1;
  fields = ["email"];
  const q = {
    selector: {
      email: { "$eq": email_},
    },
    fields: [ "email"],
    limit:50
  };
  db.find(q).then((body) => {
    if(body.docs.length==1){
      res.send("Esiste già un Account associato a questa email, torna al <a href='http://localhost:3000/login'>Login</a>");
    }
    else{
      serv.creaUtente({ nome: nome_, cognome : cognome_ ,email : email_,paese :paese_, password: password_ }).then((body) => {
     if(body.ok){
           //res.redirect("http://localhost:3000/login");
           res.redirect('/login');
     }
     else{
       res.render('error');
     }
});
//        db.insert({ nome: nome_, cognome : cognome_ ,email : email_,paese :paese_, password: password_ }).then((body) => {
//       if(body.ok){
//             //res.redirect("http://localhost:3000/login");
//             res.redirect('/login');
//       }
//       else{
//         res.render('error');
//       }
// });
    }
  });
});


module.exports = router;
