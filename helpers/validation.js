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

const itemsValidation = {
  post: () => Joi.object({
    sellerId: Joi.string().min(12).required(),
    name: Joi.string().min(4).required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    category: Joi.string().min(4).required(),
    description: Joi.string().min(5).required(),
    nameOfGame: Joi.string().min(4).required(),
    imagen: Joi.required()
  }),
  put: () => Joi.object({
    name: Joi.string().min(4),
    price: Joi.number(),
    quantity: Joi.number(),
    category: Joi.string().min(4),
    description: Joi.string().min(5),
    nameOfGame: Joi.string().min(4)
  }),
  param: () => Joi.object({
    id: Joi.string().min(12).required()
  })
};

const cartValidation = {
  post: () => Joi.object({
    userid: Joi.string().min(12).required(),
    itemid: Joi.string().min(12).required(),
    quantity: Joi.number().required()
  }),
  put: () => Joi.object({
    itemid: Joi.string().min(12).required(),
    quantity: Joi.number().required()
  }),
  param: () => Joi.object({
    itemid: Joi.string().min(12).required()
  }),
  puser: () => Joi.object({
    userid: Joi.string().min(12).required()
  })
};

const orderValidation = {
  post: () => Joi.object({
    userid: Joi.string().min(12).required()
  })
};

const inventoryValidation = {
  params: () => Joi.object({
    userid: Joi.string().min(12).required()
  })
};

module.exports = {
  loginValidation,
  registerValidation,
  itemsValidation,
  cartValidation,
  orderValidation,
  inventoryValidation
};
