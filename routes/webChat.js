var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");
const NodeCouchdb = require('node-couchdb');
require('dotenv').config();
var nano = require('nano')('http://'+process.env.USR+':'+process.env.PSW+'@localhost:5984');

const db = nano.use('utenti');


// couch.listDatabases().then(function(dbs){
//   console.log(dbs);
// });


/* GET home page. */
router.get('/', function(req, res, next)
{


  if(req.cookies['username'])
  {
    //console.log("webChat:" + req.cookies['username']);
    db.list({include_docs:true, fields:["doc"]}).then((body) => {		
		v = [];
		
		
		for(i in body.rows)
		{
			if(req.cookies['username'] != body.rows[i].doc.email)
			v.push({ "email":body.rows[i].doc.email});
		}
		//console.log(v);
		res.render('chat', {cookie: req.cookies['username'], clients:v});
	});
	

    
  }
  else {
    res.render('login');
  }

});

module.exports = router;
