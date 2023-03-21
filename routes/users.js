var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Reset = require('../models/resetUsers');
var bcrypt = require('bcrypt');
var Nodemailer = require('nodemailer');

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

// Hasher le mot de passe
router.post('/', async function(req, res, next){
    
      if(req.body[0].password != req.body[0].confirm){
        res.json({status:400,message: "Le mot de passe est incorrect"});
      }else{
       let user = await User.find( { $or:[{'email':req.body[0].email}, {'name':req.body[0].nom} ]});
        let length = user.length;
        console.log(length);
        if(length > 0){
          res.json({status:400, message: "Utilisateur existant"});
        }else{
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body[0].password, salt);
        var userHash = new User({
          name: req.body[0].nom,
          email: req.body[0].email,
          phone: req.body[0].tel,
          motDepasse: hash
        });    
        try{
          const save= await user.save();
          res.json({status:200, message:save});
        }catch(err){
          res.json({status:500, message: err});
        }}
      } 
})

// Se connecter
router.post('/login', async function(req, res, next){
  var userLogin = await User.findOne({email: req.body.email});
  if(userLogin){
    var compare = await bcrypt.compare(req.body.motDepasse,user.motDepasse);
    if(compare){
      res.json({status:200, message:"Connection avec success",user});
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

// Supprimer utilisateur
router.put('/delete/:id', async function(req, res, next){
  if(req.params.id == req.body.id){
    try{
    var userDelete = await User.updateOne({_id: req.params.id}, { $set: {userDelete}});
      if(userDelete){
        res.json("Utilisateur supprimé avec succes")
      }else{
        res.json("Echec")
      }
    }catch(err){
      res.json({message: err});
    }
  }else{
    res.json({message:"Vous n'etes pas autorisés"})
  }
})

// Reinitisaliser le mot de pass
router.post('/reset', async function(req, res, next) {
  var email = req.body.email;
  let user = await User.findOne({email});
  if(!user) res.json({message:"L'utilisateur n'existe pas"});
  await new Reset({
    email: req.body.email
  });

  const transporteur = Nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'randi.ebert44@ethereal.email',
      pass: 'UhZh36pqyrZfhd3FyB'
    },
    logger: true
  });

// Envoyer un mail 
let mailEnvoi = await transporteur.sendMail({
  from: '"Doumbouya Mohamed" <randi.ebert44@ethereal.email>', 
  to: "mohamedoum2430@gmail.com", 
  subject: "Bonjour",
  text: "Le code", // 
  html: "<b>La meilleur des apprentissages est la pratique</b>", // html body
});
res.json({message:"Nous vous soumettons ce mail de notre part"})

}
)

module.exports = router;
