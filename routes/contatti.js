var express = require('express');
var router = express.Router();

/* GET pagina contatti. */
router.get('/', function(req, res, next) {
  res.render('contatti');
});

module.exports = router;
