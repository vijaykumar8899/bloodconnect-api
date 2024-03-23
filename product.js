const mongoose = require("mongoose");

let dataSchema = new mongoose.Schema({
  name: {
    require: true,
    type: String,
  },
  isOpen: {
    require: true,
    type: Boolean,
  },
  rating: {
    require: true,
    type: String,
  },
  imageURL: {
    require: true,
    type: String,
  },
  distance: {
    require: true,
    type: String,
  },
});

module.exports = mongoose.model("node_js", dataSchema);
