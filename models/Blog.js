const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  desc: {
    type: String,
    require: true
  },
  imageUrl: {
    type: String,
    require: true
  }
});
module.exports = mongoose.model("Blog", userSchema);
