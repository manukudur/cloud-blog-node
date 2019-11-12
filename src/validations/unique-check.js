const express = require("express");

const User = require("../models/user");
const verify = require("../middlewares/verify-auth");

const router = express.Router();

router.post("/signup_check", (req, res) => {
  User.findOne({
    $or: [
      { username: req.body.username },
      { email_id: req.body.email_id },
      { phone_number: req.body.phone_number }
    ]
  })
    .then(doc => {
      if (doc) return res.status(200).json([1]);
      res.status(200).json([]);
    })
    .catch(err => res.status(500).json("something went wrong"));
});

router.post("/update_check", verify, (req, res) => {
  if (req.user.username === req.body.username) {
    return res.status(200).json([]);
  }
  User.findOne({
    $or: [
      { username: req.body.username },
      { email_id: req.body.email_id },
      { phone_number: req.body.phone_number }
    ]
  })
    .then(doc => {
      if (doc) return res.status(200).json([1]);
      res.status(200).json([]);
    })
    .catch(err => res.status(500).json("something went wrong"));
});

module.exports = router;
