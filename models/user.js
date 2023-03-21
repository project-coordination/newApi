var mongoose = require("mongoose");

var userSchema =  mongoose.Schema({
    nom: String,
    email: String,
    motDepasse: String,
    tel: String,
    
})

module.exports = mongoose.model("User", userSchema);

