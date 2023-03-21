// models/token.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
  email: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 500,
  },
});
module.exports = mongoose.model("Token", tokenSchema);