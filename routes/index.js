var express = require('express');
var router = express.Router();


router.get('/',function(req, res, next){
  res.send('BIENVENUE SUR NOTRE API');
})

module.exports = router;
