var mongoose = require("mongoose");

var courseSchema =  mongoose.Schema({
    ref: String,
    transporteur: String,
    client: String,
    cargo: String,
    typePaiement: String,
    statut: String
})

module.exports = mongoose.model("Course", courseSchema);

