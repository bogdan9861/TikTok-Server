const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");

const dotenv = require("dotenv").config();

const app = express();

app.use(cors({ origin: "*" }));
app.use("/videos", express.static(path.join(__dirname, "videos")));
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/video", require("./routes/video"));
app.use("/api/user", require("./routes/user"));

module.exports = app;
