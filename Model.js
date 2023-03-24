const mongoose = require("mongoose");

const opportunitySchema = mongoose.Schema({
  name: String,
  school: String,
  details: String,
  time: String,
  date: String,
  commitment: String,
  location: String,
  type: String,
  live: Boolean,
});

const userSchema = mongoose.Schema({
  userName: String,
  password: String,
  token: String,
});

module.exports.Opportunity = mongoose.model("Opportunity", opportunitySchema);

module.exports.User = mongoose.model("User", userSchema);
