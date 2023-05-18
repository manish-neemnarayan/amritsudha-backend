const express = require("express");
const morgan = require("morgan");
const crypto = require("crypto");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes/route");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
// app.use(cors({ origin: true, credentials: true }));
app.use(cors({
    origin: 'https://amritsudha-frontend.vercel.app',
    credentials: true
}));
// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow the specified HTTP methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
app.use(morgan('tiny'));
app.use(router);

module.exports = app;