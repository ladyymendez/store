/* eslint-disable class-methods-use-this */
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { url, body } = require('config');
const axios = require('axios');
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { Users, Items } = require('../models');
const {
  response,
  validation: { registerValidation, loginValidation },
  valid
} = require('../helpers');

const salt = bcrypt.genSaltSync(10);
const { ObjectId } = mongoose.Types;

class UsersController {
  getAll(req, res) {
    return Users.find()
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  get(req, res) {
    return valid(registerValidation.param(), req.params)
      .then(() => Users.findId(req.params.id))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  add(req, res) {
    const { name, email, password } = req.body;
    return valid(registerValidation.post(), req.body)
      .then(() => {
        const user = new Users({
          name,
          email,
          password: bcrypt.hashSync(password, salt)
        });
        return user.save();
      })
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(
        res, INTERNAL_SERVER_ERROR, err
      ));
  }

  update(req, res) {
    return valid(registerValidation.put(), req.body)
      .then(() => valid(registerValidation.param(), req.params))
      .then(() => Users.findId(req.params.id))
      .then(({ _id }) => Users.updateOne(
        { _id },
        { $set: { name: req.body.name } }
      ))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(
        res, INTERNAL_SERVER_ERROR, err
      ));
  }

  remove(req, res) {
    return valid(registerValidation.param(), req.params)
      .then(() => Users.findId(req.params.id))
      .then(() => (this.removeUserItems(req.params.id)))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(
        res, INTERNAL_SERVER_ERROR, err
      ));
  }

  removeUserItems(sellerId) {
    let session = null;
    return Items.startSession()
      .then((log) => {
        session = log;
        log.startTransaction();
        return Users.aggregate([
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
          { $addFields: { 'cart.idSeller': '$cart.shopping.sellerId' } },
          { $match: { 'cart.idSeller': ObjectId(sellerId) } },
          { $group: { _id: '$cart.idItem' } }
        ]);
      })
      .then((items) => {
        const removedItems = items.map(({ _id }) => Users.updateMany(
          {},
          { $pull: { cart: { idItem: ObjectId(_id) } } },
          { multi: true }
        ).session(session));
        return Promise.all(removedItems);
      })
      .then(() => Items.deleteMany(
        { sellerId: ObjectId(sellerId) }
      ).session(session))
      .then(() => Users.deleteOne({
        _id: sellerId
      }).session(session))
      .then(() => session.commitTransaction())
      .then(() => session.endSession());
  }

  validUser(req, res) {
    const { email, password } = req.body;
    valid(loginValidation, req.body)
      .then(() => Users.findOne({ email }))
      .then((user) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          return user;
        }
        throw new Error('Login Unsuccessful!');
      })
      .then(({ _id }) => this.token()
        .then(({ data }) => {
          const token = { ...data };
          token.userid = _id;
          return token;
        }))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((error) => response.sendError(
        res,
        INTERNAL_SERVER_ERROR,
        error.message
      ));
  }

  token() {
    return axios.post(url, body, {
      headers: { 'content-type': 'application/json' }
    });
  }
}

module.exports = UsersController;
