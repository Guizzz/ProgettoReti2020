var express = require('express');
require('dotenv').config();
var router = express.Router();

var nano = require('nano')('http://'+process.env.USR+':'+process.env.PSW+'@localhost:5984');
const db = nano.use('utenti');
/*
db.info().then((body) => {
  console.log('got database info', body);
});
db.insert({ nome: 'Nello', happy: true }).then((body) => {
  console.log(body)
})
db.insert({ nome: 'Paolo', happy: true }).then((body) => {
  console.log(body)
})
db.insert({ nome: 'Elisa', happy: false }).then((body) => {
  console.log(body)
})
db.list().then((body) => {

  body.rows.forEach((doc) => {

        console.log(doc);
  });
});

const q = {
  selector: {
    nome: { "$eq": "Nello"},

  },
  fields: [ "nome","happy"],
  limit:50
};
db.find(q).then((body) => {
  body.docs.forEach((doc) => {
    console.log(doc.nome);
});
});
*/


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

  const q = {
    selector: {
      email: { "$eq": email_},
    },
    fields: [ "email"],
    limit:50
  };
  db.find(q).then((body) => {
    if(body.docs.length==1){
      console.log(body.docs.length);
      res.send("Esiste già un Account associato a questa email, torna al <a href='http://localhost:3000/login'>Login</a>");
    }
    else{
       db.insert({ nome: nome_, cognome : cognome_ ,email : email_,paese :paese_, password: password_ }).then((body) => {
      if(body.ok){
            //res.redirect("http://localhost:3000/login");
            res.redirect('/login');
      }
      else{
        res.render('error');
      }
});
    }
  });
});


module.exports = router;
