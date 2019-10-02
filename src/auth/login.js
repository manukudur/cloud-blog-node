const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// LOCAL IMPORTS
const { loginValidation } = require("../validations/user");
const User = require("../models/user");

const router = express.Router();

router.post("/login", (req, res) => {
  const { value, error } = loginValidation(req.body);

  // pre validation
  if (error) return res.status(400).json({ message: `invalid credentials` });

  User.findOne({
    $or: [{ username: value.username }, { email_id: value.email_id }]
  })
    .then(user => {
      // check user exists
      if (!user)
        return res.status(400).json({ message: `invalid credentials` });
      // compare entered password with hashed password
      bcrypt.compare(req.body.password, user.password).then(result => {
        // if password is valid
        if (result) {
          const token = jwt.sign(
            { username: user.username },
            process.env.TOKEN_SECRET,
            { expiresIn: "1h" },
            { algorithm: "HS256" }
          );
          return res.status(200).json({ token: token });
        }
        // if password is not valid
        res.status(400).json({ message: `invalid credentials` });
      });
    })
    .catch(err => {
      res.status(400).json("server error");
    });
});
module.exports = router;
