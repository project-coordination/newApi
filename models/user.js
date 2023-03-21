var mongoose = require("mongoose");

var userSchema =  mongoose.Schema({
    nom: String,
    email: String,
    tel: String,
    motDepasse: String
})

module.exports = mongoose.model("User", userSchema);

