/* eslint-disable class-methods-use-this */
const bcrypt = require('bcryptjs');
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { Users } = require('../models');
const { response, validation: { register }, valid } = require('../helpers');

const salt = bcrypt.genSaltSync(10);

class UsersController {
  getAll(req, res) {
    return Users.find()
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  get(req, res) {
    return Users.findOne({ _id: req.params.id })
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  add(req, res) {
    const { name, email, password } = req.body;
    return valid(register, req)
      .then(() => {
        const user = new Users({
          name,
          email,
          password: bcrypt.hashSync(password, salt)
        });
        return user.save();
      })
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  update(req, res) {
    return Users.updateOne(
      { _id: req.params.id },
      { $set: { name: req.body.name } }
    )
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  remove(req, res) {
    return Users.deleteOne({
      _id: req.params.id
    })
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }
}

module.exports = UsersController;
