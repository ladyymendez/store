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
    const filter = this.getFilter(req);
    return Items.find(filter).sort(req.query.sort)
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  getItemsBySeller(req, res) {
    const { id } = req.params;
    const filter = this.getFilter(req);
    filter.sellerId = id;
    return valid(idParams, req.params)
      .then(() => Items.findId({ sellerId: req.params.id }))
      .then(() => Items.find(filter).sort(req.query.sort))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  getFilter(req) {
    const filter = {};
    if (req.query.word) {
      filter.$text = { $search: req.query.word };
    }
    return filter;
  }
}

module.exports = InventoryController;
