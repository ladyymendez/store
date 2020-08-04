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
      .then(() => Users.aggregate([
        { $match: { _id: ObjectId(userid) } },
        { $unwind: '$cart' },
        {
          $lookup: {
            from: 'items',
            localField: 'cart.idItem',
            foreignField: '_id',
            as: 'cart.shopping'
          }
        },
        { $unwind: '$cart.shopping' },
        {
          $addFields: {
            'cart.price': '$cart.shopping.price',
            'cart.name': '$cart.shopping.name',
            'cart.quantityItem': '$cart.shopping.quantity',
            'cart.sellerId': '$cart.shopping.sellerId'
          }
        },
        { $project: { 'cart.shopping': 0 } },
        { $group: { _id: '$_id', shoppingCart: { $push: '$cart' } } }
      ]))
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
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  updateItem(req, res) {
    const { itemid } = req.params;
    const { quantity, userid } = req.body;
    return valid(cartValidation.put(), req.body)
      .then(() => valid(cartValidation.param(), req.params))
      .then(() => Users.updateOne(
        {
          _id: ObjectId(userid),
          cart: { $elemMatch: { idItem: ObjectId(itemid) } }
        },
        { $set: { 'cart.$.quantity': quantity } }
      ))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  removeItem(req, res) {
    const { itemid } = req.params;
    const { userid } = req.body;
    return valid(cartValidation.param(), req.params)
      .then(() => valid(cartValidation.puser(), req.body))
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
