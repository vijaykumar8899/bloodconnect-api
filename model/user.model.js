const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const db = require("../config/db");

const { Schema } = mongoose;
const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    // unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  age: {
    type: String,
    require: true,
  },
  sex: {
    type: String,
    require: true,
  },
  blood_group: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
});


//hashing the pass with adding salt;
userSchema.pre("save", async function () {
  try {
    var user = this;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);

    user.password = hashPassword;
  } catch (e) {}
});


//comparing user entered password with the password in the database.
userSchema.methods.comparePassword = async function (userPassword) {
  try {
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
  } catch (e) {
    throw new Error("password wrong");
  }
};
const UserModel = db.model("user", userSchema);
module.exports = UserModel;
