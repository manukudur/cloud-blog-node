const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const blogs = await User.find();
    res.json(blogs);
  } catch (error) {
    res.json({ message: error });
  }
});
router.post("/login", async (req, res) => {
  try {
    const blogs = await User.findOne({ username: req.body.username });
    if (blogs) {
      const re = await bcrypt.compare(req.body.password, blogs.password);
      res.json({ re });
    }
    res.json("user not found");
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/", (req, res) => {
  const user = new User({
    username: req.body.username,
    email_id: req.body.email_id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    dob: req.body.dob,
    phone_number: req.body.phone_number,
    password: req.body.password
  });
  user
    .save()
    .then(data => {
      res.status(200).json({ message: "Created", user: data });
    })
    .catch(err => {
      const {
        username: usernameErr = {},
        email_id: emailErr = {},
        first_name: firstNameErr = {},
        last_name: lastNameErr = {},
        dob: dobErr = {},
        phone_number: phoneNumber = {},
        password: password = {}
      } = err.errors;
      res.status(400).json({
        errors: {
          username: usernameErr.message,
          email_id: emailErr.message,
          first_name: firstNameErr.message,
          last_name: lastNameErr.message,
          dob: dobErr.message,
          phone_number: phoneNumber.message,
          password: password.message
        }
      });
    });
});
router.delete("/:blogId", async (req, res) => {
  try {
    const removedBlog = await User.deleteOne({ _id: req.params.blogId });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
