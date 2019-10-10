const express = require("express");
const router = express.Router();

// LOCAL IMPORTS
const User = require("../models/user");
const Blog = require("../models/blog");
const { signupValidation } = require("../validations/user");

router.get("/:username", async (req, res) => {
  // checking username is valid or not
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "user not exists" });

    const blogs = await Blog.find({ creator: req.params.username })
      .select("title desc username image_url")
      .sort({ created_time: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.post("/signup", (req, res) => {
  const { value, error } = signupValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  new User({
    username: value.username,
    email_id: value.email_id,
    first_name: value.first_name,
    last_name: value.last_name,
    dob: value.dob,
    phone_number: value.phone_number,
    password: value.password
  })
    .save()
    .then(data => {
      res.status(201).json({ message: "created" });
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

module.exports = router;
