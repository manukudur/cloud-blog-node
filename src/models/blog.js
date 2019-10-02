const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const blogSchema = mongoose.Schema({
  creator: {
    type: String,
    ref: "User",
    required: true
  },
  created_time: {
    type: Date,
    required: true,
    default: Date.now
  },
  title: {
    type: String,
    required: true,
    minlength: [3, "title must be at least 3 characters long"],
    trim: true,
    unique: true
  },
  desc: {
    type: String,
    required: true,
    minlength: [10, "description must be at least 10 characters long"],
    trim: true
  },
  image_url: {
    type: String,
    trim: true
  }
});

blogSchema.plugin(uniqueValidator, { message: "this {PATH} already exists" });
module.exports = mongoose.model("Blog", blogSchema);
