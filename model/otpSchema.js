const express = require("express");
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phoneNumber: String,
  opt: String,
});

const OtpModel = mongoose.model("Otp", otpSchema);
module.exports = OtpModel;
