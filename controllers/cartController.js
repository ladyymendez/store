/* eslint-disable class-methods-use-this */
const mongoose = require('mongoose');
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { Users } = require('../models');
const {
  response,
  validation: { cartValidation },
  valid
} = require('../helpers');

const { ObjectId } = mongoose.Types;

class CartController {
  getAll(req, res) {
    const { userid } = req.params;
    return valid(cartValidation.puser(), req.params)
      .then(() => Users.findId(userid))
      .then(() => Users.getCart(userid))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  add(req, res) {
    const { userid, itemid, quantity } = req.body;
    return valid(cartValidation.post(), req.body)
      .then(() => Users.updateOne(
        {
          _id: ObjectId(userid)
        },
        { $push: { cart: { idItem: ObjectId(itemid), quantity } } }
      ))
      .then(() => Users.getItem(itemid, userid))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  updateItem(req, res) {
    const { userid } = req.params;
    const { quantity, itemid } = req.body;
    return valid(cartValidation.put(), req.body)
      .then(() => valid(cartValidation.puser(), req.params))
      .then(() => Users.updateOne(
        {
          _id: ObjectId(userid),
          cart: { $elemMatch: { idItem: ObjectId(itemid) } }
        },
        { $set: { 'cart.$.quantity': quantity } }
      ))
      .then(() => Users.getItem(itemid, userid))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  removeItem(req, res) {
    const { userid } = req.params;
    const { itemid } = req.body;
    return valid(cartValidation.puser(), req.params)
      .then(() => valid(cartValidation.param(), req.body))
      .then(() => Users.updateOne(
        {
          _id: ObjectId(userid)
        },
        { $pull: { cart: { idItem: ObjectId(itemid) } } }
      ))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }
}

module.exports = CartController;
