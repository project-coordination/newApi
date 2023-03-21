var mongoose = require("mongoose");

var transporteurSchema =  mongoose.Schema({
    nom: String,
    email: String,
    motDepasse: String,
    localisation: String,
    camion:{type: String, enum: ['Any', 'Small', 'Light', 'Medium', 'Heavy']},
    company_id: String
})

module.exports = mongoose.model("Transporteur", transporteurSchema);
