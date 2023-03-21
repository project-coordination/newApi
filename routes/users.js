var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');



// Obtenir tous les utilisateurs
router.get('/',async function(req, res, next) {
  var getUser = await User.find();
  res.json(getUser);
});

// Obtenir un utilisateur specifique
router.get('/:id',async function(req, res, next) {
  var getUserById = await User.findById(req.params.id);
  res.json(getUserById);
});


router.post('/', async function(req, res, next){
    
      // if(req.body.motDepasse != req.body.confirm){
        // res.json({status:400,message: "Le mot de passe ne concoorde pas"});
      // }else{
       let userAdd = await User.find( { $or:[{'email':req.body.email}, {'nom':req.body.nom} ]});
        let length = userAdd.length;
        if(length > 0){
          res.json({status:400, message: "Utilisateur existant"});
        }else{
        var user = new User
        (
          req.body
        //   {
        //   // nom: req.body.nom,
        //   // email: req.body.email,
        //   // tel: req.body.tel,
        //   // motDepasse: req.body.motDepasse
        // }
        );    
        try{
          const save= await user.save();
          res.json({status:200, message:save});
        }catch(err){
          res.json({status:500, message: err});
        }}
      // } 
})

// Se connecter
router.post('/login', async function(req, res, next){
  var userLogin = await User.findOne({email: req.body.email});
  if(userLogin){
    if(userLogin.motDepasse === req.body.motDepasse){
      res.json({status:200, message:"Connection avec success",userLogin});
    }else{
      res.json({status:400, message:"Mot de passe incorrect"});
    }
  }else{
    res.json({status:400, message: "Cet utilisateur n'existe pas"});
  }
})

// Mettre à jour un utilisateur
router.put('/:id', async function(req, res, next){
  if(req.params.id != req.body.id){
    res.json("Les informations ne concordent pas")
  }else{
    try{
    var userUpdate = await User.updateOne({_id: req.params.id}, { $set: {nom: req.body.nom, tel:req.body.tel, email:req.body.email }});

      if(userUpdate){
        var user = await User.findById(req.params.id);
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
