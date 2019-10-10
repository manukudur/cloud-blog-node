const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    minlength: [4, "username must be at least 4 characters long"],
    maxlength: 50,
    required: [true, "username is required"],
    unique: true,
    match: [
      /^[a-z0-9]+$/,
      "username may only contain alphanumeric characters, a–z or 0-9."
    ]
  },
  email_id: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "email-id is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "please fill a valid email address"
    ],
    unique: true
  },
  first_name: {
    type: String,
    trim: true,
    lowercase: true,
    minlength: [3, "first name must be at least 3 characters long"],
    maxlength: 50,
    required: [true, "first name is required"],
    match: [
      /^[a-zA-Z ]*$/,
      "first name should be only alphabetical letters, A–Z or a–z."
    ]
  },
  last_name: {
    type: String,
    trim: true,
    lowercase: true,
    minlength: [1, "last name must be at least 1 character"],
    maxlength: 50,
    required: [true, "last name is required"],
    match: [
      /^[a-zA-Z ]*$/,
      "last name should be only alphabetical letters, A–Z or a–z."
    ]
  },
  dob: {
    type: Date,
    required: [true, "dob is required, eg:(mm-dd-yyyy)"]
  },
  phone_number: {
    type: Number,
    required: [true, "phone number is required"],
    unique: true,
    trim: true,
    validate: {
      validator: function(number) {
        return /^\d{10}$/.test(number);
      },
      message: () => `phone number should be 10 digits, eg:(9012345678)`
    }
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [6, "minimum length should be 6 characters"],
    match: [
      // https://regex101.com/r/bsIUUC/1
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])[0-9A-Za-z" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"]{6,1024}$/,
      "password should contain alphanumerics eg:(a-z,A-Z,0-9) and specical characters eg:(!@#$%^&*[].)"
    ]
  }
});
userSchema.pre("save", function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
userSchema.plugin(uniqueValidator, { message: "this {PATH} already exists" });
module.exports = mongoose.model("User", userSchema);
