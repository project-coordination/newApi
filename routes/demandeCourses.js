var express = require('express');
var router = express.Router();
var Demand = require('../models/demandeCourses');
var Transporter = require('../models/transporteurs');
var User = require('../models/user');
var bcrypt = require('bcrypt')


router.get('/',async function(req, res, next){
    var demands = await Demand.find();
  res.json(demands);
})

router.post('/', async function(req, res, next){
    let user = await User.findById(req.body.client_id);
    if(!user) res.json({message: 'User not found'});
    var demand1 = new Demand({
        cargo:req.body.cargo,
        truck:req.body.truck,
        date:req.body.date,
        hour:req.body.hour,
        location_from: req.body.location_from,
        city_from:req.body.city_from,
        location_to: req.body.location_to,
        city_to:req.body.city_to,
        dimension: req.body.dimension,
        statut: "en_attente",
        payment_type: req.body.payment_type,
        client_id: req.body.client_id
    })
    try{
        await demand1.save();
        res.json({message:"Demand saved!!",demand1});
    }catch(err){
        res.json(err);
    }  
}
)

router.get('/:id', async function(req, res, next){
    var id = req.params.id;
    // var transporter = await Transporter.findById(id);
    // var location = transporter.location;
    // var truck = transporter.truck;

    var demands = await Demand.find({client_id: id});
    console.log(demands);
    res.json(demands);
})

router.put('/apply', async function(req, res, next){
    try{
        var demand = await Demand.findById({_id:req.body.demandId});
        console.log(demand)
        if(!demand) res.json({"message":"Transport offer does not exists. Retry!!!"});
        const currentTransporter = await Transporter.findOne({_id:req.body.transporterId});
        if(!currentTransporter) res.json({"message":"Error with your account. Retry!!!"});
        if(!demand.postulants.includes(req.body.transporterId)){
          await demand.updateOne({$push: {postulants: req.body.transporterId}});
          return res.status(200).json("Apply success !!!");
        }else{
          return res.status(403).json("You allready apply for this transport");
        }
    }catch(err){
    return res.status(500).json(err);
    console.log("echec")
    }
})


module.exports = router;
