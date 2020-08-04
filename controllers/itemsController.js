/* eslint-disable class-methods-use-this */
const mongoose = require('mongoose');
const fs = require('fs').promises;
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { Items, Users } = require('../models');
const {
  response,
  validation: { itemsValidation },
  valid
} = require('../helpers');

const { ObjectId } = mongoose.Types;

class ItemsController {
  add(req, res) {
    const nameImg = `${this.nameUrl(
      req.body.name + new Date().toGMTString()
    )}.jpg`;
    const urlName = nameImg;

    const item = new Items({
      sellerId: req.body.sellerId,
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      attribute: req.body.attribute,
      description: req.body.description,
      nameOfGame: req.body.nameOfGame,
      imagen: urlName
    });

    return valid(itemsValidation.post(), req.body)
      .then(() => item.save())
      .then((itemCreated) => this.saveImg(req, nameImg)
        .then(() => itemCreated))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(
        res, INTERNAL_SERVER_ERROR, err.message
      ));
  }

  get(req, res) {
    return valid(itemsValidation.param(), req.params)
      .then(() => Items.findOne({ _id: req.params.id }))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(
        res, INTERNAL_SERVER_ERROR, err.message
      ));
  }

  update(req, res) {
    return valid(itemsValidation.param(), req.params)
      .then(() => Items.findById({ _id: req.params.id }))
      .then((item) => Items.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            name: req.body.name || item.name,
            quantity: req.body.quantity || item.quantity,
            attribute: req.body.attribute || item.attribute,
            description: req.body.description || item.description,
            nameOfGame: req.body.nameOfGame || item.nameOfGame,
            imagen: req.body.imagen || item.imagen
          }
        },
        { new: true }
      ))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(
        res, INTERNAL_SERVER_ERROR, err.message
      ));
  }

  remove(req, res) {
    return valid(itemsValidation.param(), req.params)
      .then(() => this.removeItems(req.params.id))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(
        res, INTERNAL_SERVER_ERROR, err.message
      ));
  }

  removeItems(idItem) {
    let session = null;
    return Items.startSession()
      .then((log) => {
        session = log;
        log.startTransaction();
        return Items.deleteOne({
          _id: ObjectId(idItem)
        }).session(session);
      })
      .then(() => (
        Users.updateMany(
          {},
          { $pull: { cart: { idItem: ObjectId(idItem) } } },
          { multi: true }
        ).session(session)
      ))
      .then(() => session.commitTransaction())
      .then(() => session.endSession());
  }

  nameUrl(name) {
    const lowerCase = name.toLowerCase();
    const array = lowerCase.split(/\s+/gi);
    return array.join('-');
  }

  saveImg(req, nameImg) {
    const { imagen } = req.body;
    const base64Image = imagen.split(';base64,').pop();
    return fs.writeFile(
      `imagen/${nameImg}`,
      base64Image,
      { encoding: 'base64' }
    );
  }
}

module.exports = ItemsController;
