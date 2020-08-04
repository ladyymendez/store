/* eslint-disable class-methods-use-this */
const mongoose = require('mongoose');
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const {
  response,
  validation: { orderValidation },
  valid
} = require('../helpers');
const { Orders } = require('../models');

const { ObjectId } = mongoose.Types;

class HistoryController {
  getShopping(req, res) {
    const { userid } = req.params;
    return valid(orderValidation.post(), req.params)
      .then(() => Orders.find({ userId: ObjectId(userid) }))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  getSales(req, res) {
    const { userid } = req.params;
    return valid(orderValidation.post(), req.params)
      .then(() => Orders.getSoldByUser(userid))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }
}

module.exports = HistoryController;
