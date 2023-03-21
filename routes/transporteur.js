var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Transporter = require('../models/transporteurs');



router.get('/',async function(req, res, next) {
    var transporters = await Transporter.find();
  res.json(transporters);
});

router.post('/', async function(req, res, next){
    if(req.body.motDepasse != req.body.confirm){
      res.json({status:400,message: "Le mot de passe ne correspond pas"});
    }else{
  
      let transporter1 = await Transporter.find( { $or:[{'email':req.body.email}, {'nom':req.body.nom} ]});
      let length = transporter1.length;
        if(length > 0){
        res.json({status:400,message: "Ce transporteur existe deja"});
      }else{
     
      var transporter = new Transporter({
        nom: req.body.nom,
        email: req.body.email,
        motDepasse: req.body.motDepasse,
        localisation:req.body.localisation,
        camion:req.body.camion,
     
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
    if(req.body.motDepasse===transporter.motDepasse){
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
