var express = require('express');
var router = express.Router();

/* GET pagina contatti. */
router.get('/', function(req, res, next) {
  res.render('contatti',{cookie: req.cookies['username']});
});

module.exports = router;
