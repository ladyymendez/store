const Joi = require('joi');

const login = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required()
});

module.exports = {
  login
};
