const mongoose = require("mongoose");

const opportunitySchema = mongoose.Schema({
  name: String,
  school: String,
  details: String,
  year: String,
  startTime: String,
  finishTime: String,
  date: Date,
  commitment: String,
  location: String,
  type: String,
  info: String,
  special: Boolean,
  live: Boolean,
});

const userSchema = mongoose.Schema({
  userName: String,
  password: String,
  token: String,
});

module.exports.Opportunity = mongoose.model("Opportunity", opportunitySchema);

module.exports.User = mongoose.model("User", userSchema);
