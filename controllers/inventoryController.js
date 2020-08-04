/* eslint-disable class-methods-use-this */
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { Items } = require('../models');
const {
  response,
  validation: { idParams },
  valid
} = require('../helpers');

class InventoryController {
  getAll(req, res) {
    // const { seller } = req.query;
    // sellerId: { $ne: seller }
    return Items.find({})
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  getItems(req, res) {
    const { id } = req.params;
    return valid(idParams, req.params)
      .then(() => Items.find({ sellerId: id }))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }
}

module.exports = InventoryController;
