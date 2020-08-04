const Joi = require('joi');

const loginValidation = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required()
});

const registerValidation = {
  post: () => Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  }),
  put: () => Joi.object({
    name: Joi.string().min(2).required()
  }),
  param: () => Joi.object({
    id: Joi.string().min(12).required()
  })
};

module.exports = {
  loginValidation,
  registerValidation
};
