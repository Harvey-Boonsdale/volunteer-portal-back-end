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

const port = process.env.PORT;
const url = process.env.CONNECTION_STRING;

// const dburi = process.env.CONNECTION_STRING;
// const { v4: uuidv4 } = require("uuid");

// mongoose.connect(dburi, { useNewUrlParser: true });

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
    origin: ["http://localhost:3000"],
  })
);

// get request to test server

// app.get("/", (req, res) => {
//   console.log("arriving at server");
//   res.send("message received");
// });

// Create new opportunity and add to database

app.post("/opportunities", async (req, res) => {
  if (
    !req.body.name ||
    !req.body.school ||
    !req.body.details ||
    !req.body.time ||
    !req.body.date ||
    !req.body.commitment ||
    !req.body.location
  ) {
    return res.sendStatus(400);
  }
  const opportunity = new Opportunity({
    name: req.body.name,
    school: req.body.school,
    details: req.body.details,
    time: req.body.time,
    date: req.body.date,
    commitment: req.body.commitment,
    location: req.body.location,
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

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
  console.log("Database connected");
});
