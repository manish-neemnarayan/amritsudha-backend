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
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('tiny'));
app.use(router);

module.exports = app;