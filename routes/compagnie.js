var express = require('express');
var router = express.Router();
var Company = require('../models/compagnie');
var bcrypt = require('bcrypt')


router.get('/',async function(req, res, next){
    var companies = await Company.find();
  res.json(companies);
})

router.post('/', async function(req, res, next){
      if(req.body.password != req.body.confirm){
        res.json({message: "Passwords does not match"});
      }else{
        // let company1 = await Company.findOne({email: req.body.email});
       let company1 = await Company.find( { $or:[{'email':req.body.email}, {'name':req.body.name} ]});

        if(company1){
          res.json({message: "This Company already exists"});
        }else{
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt);
        var company = new Company({
          name: req.body.name,
          email: req.body.email,
          password: hash
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
      res.json({message:"Login success",company:company1});
    }else{
      res.json({message:"Password error"});
    }
  }else{
    res.json({message: "This Company does not exists"});
  }
})

module.exports = router;
