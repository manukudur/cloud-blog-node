const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  created: {
    type: Date,
    require: true,
    default: Date.now
  },
  title: {
    type: String,
    trim: true,
    require: true
  },
  desc: {
    type: String,
    require: true,
    trim: true
  },
  image_url: {
    type: String,
    require: true,
    trim: true
  }
});
module.exports = mongoose.model("Blog", blogSchema);
