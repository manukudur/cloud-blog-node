const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  created: {
    type: Date,
    require: true,
    default: Date.now
  },
  title: {
    type: String,
    require: true,
    trim: true
  },
  desc: {
    type: String,
    require: true,
    trim: true
  },
  imageUrl: {
    type: String,
    require: true,
    trim: true
  }
});
module.exports = mongoose.model("Blog", blogSchema);
