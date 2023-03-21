var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Transporter = require('../models/transporteurs');
var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/',async function(req, res, next) {
    var transporters = await Transporter.find();
  res.json(transporters);
});

router.post('/', async function(req, res, next){
    if(req.body[0].password != req.body[0].confirm){
      res.json({status:400,message: "Passwords does not match"});
    }else{
      // let transporter1 = await Transporter.findOne({email: req.body.email});
      let transporter1 = await Transporter.find( { $or:[{'email':req.body[0].email}, {'name':req.body[0].name} ]});
      let length = transporter1.length;
        if(length > 0){
        res.json({status:400,message: "This Transporter already exists"});
      }else{
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(req.body[0].password, salt);
      var transporter = new Transporter({
        name: req.body[0].name,
        email: req.body[0].email,
        password: hash,
        location:req.body[0].location,
        truck:req.body[0].truck,
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
    var compare = await bcrypt.compare(req.body.password,transporter.password);
    if(compare){
      res.json({status:200, message:"Login success",transporter});
    }else{
      res.json({status:400, message:"Password error"});
    }
  }else{
    res.json({status:400, message: "This Transporter does not exists"});
  }
})

router.put('/:id', async function(req, res, next){
  if(req.params.id != req.body.id){
    res.json("Informations does not match")
  }else{
    try{
    var save = await Transporter.updateOne({_id: req.params.id}, { $set: {name: req.body.name, location:req.body.location, truck:req.body.truck, email:req.body.email }});

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
