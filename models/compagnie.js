var mongoose = require("mongoose");

var compagnieSchema =  mongoose.Schema({
    nom: String,
    email: String,
    motDepasse: String
})

module.exports = mongoose.model("Compagnie", compagnieSchema);

