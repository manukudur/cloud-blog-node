const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// LOCAL IMPORTS
const User = require("../models/user");
const Blog = require("../models/blog");
const {
  signupValidation,
  passwordUpdate,
  usernameValidation
} = require("../validations/user");
const verify = require("../middlewares/verify-auth");

router.get("/profile", verify, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).select(
      "first_name last_name username email_id phone_number dob"
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/:username", async (req, res) => {
  // checking username is valid or not
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "user not exists" });

    const blogs = await Blog.find({ creator: req.params.username })
      .select("title desc creator created_time image_url")
      .sort({ created_time: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.post("/updateUsername", verify, async (req, res) => {
  const { value, error } = usernameValidation(req.body);
  if (error) {
    return res.status(400).json({ message: "pattern not matching" });
  }
  try {
    const user = await User.findOneAndUpdate(
      { username: req.user.username },
      { $set: { username: value.username } },
      { new: true, useFindAndModify: false }
    ).select("username");
    await Blog.updateMany(
      { creator: req.user.username },
      { $set: { creator: value.username } }
    );
    const token = jwt.sign(
      { username: value.username },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" },
      { algorithm: "HS256" }
    );
    res.status(200).json({
      user: user.username,
      token: token,
      message: "Username Updated sucessfully"
    });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.post("/changePassword", verify, async (req, res) => {
  const { value, error } = passwordUpdate(req.body);
  if (error) {
    return res.status(400).json({ message: "pattern not matching" });
  }
  User.findOne({ username: req.user.username })
    .then(user => {
      bcrypt.compare(value.old_password, user.password).then(result => {
        if (result && value.new_password === value.confirm_password) {
          bcrypt.hash(value.new_password, 10, function(err, hash) {
            if (err) {
              return res
                .status(500)
                .json({ message: "something went wrong, try again" });
            }
            User.findOneAndUpdate(
              { username: req.user.username },
              { $set: { password: hash } },
              { useFindAndModify: false }
            ).then(data => {
              if (data) {
                res
                  .status(200)
                  .json({ message: "Password Updated sucessfully" });
              }
            });
          });
        } else {
          res.status(500).json({ message: "something went wrong, try again" });
        }
      });
    })
    .catch(err => {
      res.status(500).json({ message: "something went wrong, try again" });
    });
});

router.post("/delete", verify, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ message: "user not exists" });

    bcrypt.compare(req.body.password, user.password).then(async result => {
      if (result) {
        await User.findOneAndDelete({ username: req.user.username });
        await Blog.deleteMany({ creator: req.user.username });
        return res.status(200).json({
          message: "User Profile and User Blogs are removed from database"
        });
      }
      return res.status(400).json({ message: "Invalid Password" });
    });
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
