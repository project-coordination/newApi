var express = require('express');
var router = express.Router();
var Company = require('../models/compagnie');
var bcrypt = require('bcrypt')


router.get('/',async function(req, res, next){
    var companies = await Company.find();
  res.json(companies);
})

router.post('/', async function(req, res, next){
      if(req.body.motDepasse != req.body.confirm){
        res.json({message: "Le mot de passe ne correspond pas"});
      }else{
    
       let company1 = await Company.find( { $or:[{'email':req.body.email}, {'nom':req.body.nom} ]});

        if(company1){
          res.json({message: "Cette compagnie existe"});
        }else{
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.motDepasse, salt);
        var company = new Company({
          nom: req.body.nom,
          email: req.body.email,
          motDepasse: hash
        });    
        try{
          const save= await company.save();
          res.json(save)
        }catch(err){
          res.json({message: err});
        }
    }
          
 }}
)

router.post('/login', async function(req, res, next){
  var company1 = await Company.findOne({email: req.body.email});
  if(company1){
    var compare = await bcrypt.compare(req.body.password,company1.password);
    if(compare){
      res.json({message:"Connecté avec succes",company:company1});
    }else{
      res.json({message:"Echec de mot passe"});
    }
  }else{
    res.json({message: "Cette compagnie n'existe pas"});
  }
})

module.exports = router;
