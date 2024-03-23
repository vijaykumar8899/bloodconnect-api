const express = require("express");
const mongoose = require("mongoose");

// mongodb+srv://<jaykumarm416>:<T8E7pRMGZEt6d3ZO>@cluster0.mrtwxtk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

//connect mongoose
mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb+srv://jaykumarm416:T8E7pRMGZEt6d3ZO@cluster0.mrtwxtk.mongodb.net/flutter"
);

const db = mongoose.connection;
module.exports = db;
