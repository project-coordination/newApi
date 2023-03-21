var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Transporter = require('../models/transporteurs');
var bcrypt = require('bcrypt');


router.get('/',async function(req, res, next) {
    var transporters = await Transporter.find();
  res.json(transporters);
});

router.post('/', async function(req, res, next){
    if(req.body[0].motDepasse != req.body[0].confirm){
      res.json({status:400,message: "Le mot de passe ne correspond pas"});
    }else{
  
      let transporter1 = await Transporter.find( { $or:[{'email':req.body[0].email}, {'nom':req.body[0].nom} ]});
      let length = transporter1.length;
        if(length > 0){
        res.json({status:400,message: "Ce transporteur existe deja"});
      }else{
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(req.body[0].motDepasse, salt);
      var transporter = new Transporter({
        nom: req.body[0].nom,
        email: req.body[0].email,
        motDepasse: hash,
        localisation:req.body[0].localisation,
        camion:req.body[0].camion,
        company_id:req.body[0].company_id
      });    
      try{
        const save= await transporter.save();
        res.json({status:200,message:save})
      }catch(err){
        res.json({status:500, message: err});
      }
  }        
}}
)

router.post('/login', async function(req, res, next){
  var transporter = await Transporter.findOne({email: req.body.email});
  if(transporter){
    var compare = await bcrypt.compare(req.body.motDepasse,transporter.motDepasse);
    if(compare){
      res.json({status:200, message:"Connecté avec succes",transporter});
    }else{
      res.json({status:400, message:"Mot de passe incorrecte"});
    }
  }else{
    res.json({status:400, message: "Ce transporteur n'existe pas"});
  }
})

router.put('/:id', async function(req, res, next){
  if(req.params.id != req.body.id){
    res.json("Les informations ne concordent pas")
  }else{
    try{
    var save = await Transporter.updateOne({_id: req.params.id}, { $set: {nom: req.body.nom, localisation:req.body.localisation, truck:req.body.truck, email:req.body.email }});

      if(save){
        var user = await Transporter.findById(req.params.id);
        res.json({status:200,message:"succès",user:user});
      }else{
        res.json("echec")
      }
    }catch(err){
      res.json({message: err});
    }
  }
})

module.exports = router;
