const Joi = require("@hapi/joi");

// Signup Validation
const signupValidation = data => {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .alphanum()
      .lowercase()
      .min(4)
      .max(50)
      .trim(),
    email_id: Joi.string()
      .required()
      .email()
      .lowercase()
      .trim(),
    first_name: Joi.string()
      .required()
      .lowercase()
      .min(3)
      .max(50)
      .trim(),
    last_name: Joi.string()
      .required()
      .trim()
      .lowercase()
      .min(1)
      .max(50),
    dob: Joi.date().required(),
    phone_number: Joi.number().required(),
    password: Joi.string()
      .required()
      .min(6)
      .pattern(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])[0-9A-Za-z" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"]{6,1024}$/
      ),
    confirm_password: Joi.ref("password")
  }).with("password", "confirm_password");
  return schema.validate(data);
};

// username Validation
const usernameValidation = data => {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .alphanum()
      .lowercase()
      .min(4)
      .max(50)
      .trim()
  });
  return schema.validate(data);
};

// Login Validation
loginValidation = data => {
  const schema = Joi.object({
    username: Joi.string()
      .alphanum()
      .trim()
      .lowercase(),
    email_id: Joi.string()
      .email()
      .lowercase()
      .trim(),
    password: Joi.string()
  })
    .with("username", "password")
    .with("email_id", "password");
  return schema.validate(data);
};

// Password Update
passwordUpdate = data => {
  const schema = Joi.object({
    old_password: Joi.string()
      .required()
      .min(6)
      .pattern(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])[0-9A-Za-z" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"]{6,1024}$/
      ),
    new_password: Joi.string()
      .required()
      .min(6)
      .pattern(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])[0-9A-Za-z" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"]{6,1024}$/
      ),
    confirm_password: Joi.string()
      .required()
      .min(6)
      .pattern(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])[0-9A-Za-z" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"]{6,1024}$/
      )
  });
  return schema.validate(data);
};

module.exports.signupValidation = signupValidation;
module.exports.loginValidation = loginValidation;
module.exports.passwordUpdate = passwordUpdate;
module.exports.usernameValidation = usernameValidation;
