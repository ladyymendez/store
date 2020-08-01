/* eslint-disable class-methods-use-this */
const { Users } = require('../models');
const { logger } = require('../shared');

class UsersController {
  getAll(req, res) {
    return Users.find()
      .then((data) => this.sendSuccess(data, req, res))
      .catch((err) => this.sendError(res, err));
  }

  get(req, res) {
    return Users.findOne({ _id: req.params.id })
      .then((data) => this.sendSuccess(data, req, res))
      .catch((err) => this.sendError(res, err));
  }

  add(req, res) {
    const user = new Users({
      name: req.body.name,
      type: req.body.type
    });
    return user.save()
      .then((data) => this.sendSuccess(data, req, res))
      .catch((err) => this.sendError(res, err));
  }

  update(req, res) {
    return Users.updateOne(
      { _id: req.params.id },
      { $set: { name: req.body.name } }
    )
      .then((data) => this.sendSuccess(data, req, res))
      .catch((err) => this.sendError(res, err));
  }

  remove(req, res) {
    return Users.deleteOne({
      _id: req.params.id
    })
      .then((data) => this.sendSuccess(data, req, res))
      .catch((err) => this.sendError(res, err));
  }

  sendSuccess(data, req, res) {
    if (!data || data.nModified === 0 || data.deletedCount === 0) {
      logger.error(`ID not found in ${req.method}, url ${req.url}`);
      return res.status(404).json({ message: 'resource not found' });
    }
    return res.status(200).json(data);
  }

  sendError(res, err) {
    const msg = { message: err };
    if (err.kind === 'ObjectId') {
      msg.message = 'Error Id';
    }
    logger.error(`Error on the server, ${msg.message}`);
    return res.status(500).json(msg);
  }
}

module.exports = UsersController;
