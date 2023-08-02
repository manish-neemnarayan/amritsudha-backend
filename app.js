const express = require("express");
const morgan = require("morgan");
const crypto = require("crypto");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes/route");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: "*", // Replace with the actual origin of your React application
  credentials: true // Allow including credentials (cookies)
}));
// app.use(cors());

app.use(cookieParser());
app.use(morgan('tiny'));
app.use(router);

// Enable CORS
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});


module.exports = app;