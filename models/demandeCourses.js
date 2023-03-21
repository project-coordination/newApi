var mongoose = require("mongoose");
var demandeCourseSchema =  mongoose.Schema({
    cargo: {type: String, enum: ['Nourriture', 'Transport general', 'Transport voiture', 'Nourritures concervés', 'Les boissons', 'Transportant urgent','Nourriture exclues']},
    camion: {type: String, enum: ['Any', 'Small', 'Light', 'Medium', 'Heavy']},
    date: String,
    hour:String,
    localisation: String,
    villeDepart:String,
    localisation: String,
    villeDarrivee:String,
    dimension: String, 
    typePaiement: {type: String, enum: ['Fixer le prix', 'devis', 'Methode de paiement']},
    statut:{type: String},
    client_id:{},
    postulants:{type: Array, default: []}
})

module.exports = mongoose.model("DemandeCourses", demandeCourseSchema);
