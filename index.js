require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const { ObjectId } = require("mongodb");
const { Opportunity } = require("./Model");
const { User } = require("./Model");

const port = process.env.PORT;
const url = process.env.CONNECTION_STRING;

const dburi = process.env.CONNECTION_STRING;
const { v4: uuidv4 } = require("uuid");

mongoose.connect(dburi, { useNewUrlParser: true });

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests - cross origin response
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));
app.use(
  express.json({
    origin: ["http://localhost:3000", "https://volunteer-portal.onrender.com"],
  })
);

// Add new user

app.post("/users", async (req, res) => {
  if (!req.body.userName || !req.body.password) {
    return res.sendStatus(400);
  }
  const user = new User({
    userName: req.body.userName,
    password: req.body.password,
  });
  await user.save();
  res.send("User Added!");
});

// Front end sends request for user to login
// if credentials are valid
// send secret to allow past middleware

app.post("/auth", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.sendStatus(401);
  }
  if (user.password !== req.body.password) {
    return res.sendStatus(403);
  }
  user.token = uuidv4();
  await user.save();
  console.log(user);
  return res.send({ token: user.token });
});

app.get("/users", async (req, res) => {
  res.send(await User.find());
});

// Custom Middleware for Authentication

app.use(async (req, res, next) => {
  const userToken = req.headers.authorization;
  const user = await User.findOne({ token: userToken });
  if (user) {
    next();
  } else {
    res.sendStatus(403);
  }
});

// Create new opportunity and add to database

app.post("/opportunities", async (req, res) => {
  if (
    !req.body.name ||
    !req.body.school ||
    !req.body.details ||
    !req.body.commitment ||
    !req.body.location ||
    !req.body.type
  ) {
    console.log("Error here", req.body);
    return res.sendStatus(400);
  }
  const opportunity = new Opportunity({
    name: req.body.name,
    school: req.body.school,
    details: req.body.details,
    year: req.body.year,
    startTime: req.body.startTime,
    finishTime: req.body.finishTime,
    date: req.body.date,
    tba: req.body.tba,
    commitment: req.body.commitment,
    location: req.body.location,
    info: req.body.info,
    type: req.body.type,
    live: true,
  });
  await opportunity.save();
  res.send("Opportunity added");
});

mongoose.connect(url);
app.listen(port, () => {
  console.log("server is live on port " + port);
});

// Get all opportunities from database

app.get("/opportunities", async (req, res) => {
  const opportunities = await Opportunity.find();
  res.send(opportunities);
});

// Get one opportunity

app.get("/opportunities/:id", async (req, res) => {
  const opportunity = await Opportunity.findOne({
    _id: new ObjectId(req.params.id),
  });
  res.send(opportunity);
});

// Edit Opportunity

app.put("/opportunities/:id", async (req, res) => {
  const opportunity = await Opportunity.findOne({
    _id: new ObjectId(req.params.id),
  });
  if (!opportunity) {
    return res.sendStatus(404);
  }

  if (
    !req.body.name ||
    !req.body.school ||
    !req.body.details ||
    !req.body.commitment ||
    !req.body.location ||
    !req.body.type
  ) {
    return res.sendStatus(400);
  }

  (opportunity.name = req.body.name),
    (opportunity.school = req.body.school),
    (opportunity.details = req.body.details),
    (opportunity.year = req.body.year),
    (opportunity.startTime = req.body.startTime),
    (opportunity.finishTime = req.body.finishTime),
    (opportunity.date = req.body.date),
    (opportunity.tba = req.body.tba),
    (opportunity.commitment = req.body.commitment),
    (opportunity.location = req.body.location),
    (opportunity.info = req.body.info),
    (opportunity.type = req.body.type),
    (opportunity.live = true),
    await opportunity.save();
  res.send("Opportunity Changed!");
});

// Delete Opportunity

app.delete("/opportunities/:id", async (req, res) => {
  const response = await Opportunity.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  if (response.deletedCount) {
    res.send({ result: true });
  } else {
    res.sendStatus(404);
  }
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
  console.log("Database connected");
});
