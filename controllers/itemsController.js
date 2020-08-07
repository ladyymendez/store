/* eslint-disable class-methods-use-this */
const mongoose = require('mongoose');
const fs = require('fs');
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { Items, Users } = require('../models');
const {
  response,
  validation: { itemsValidation },
  valid
} = require('../helpers');

const { ObjectId } = mongoose.Types;

const prom = fs.promises;

class ItemsController {
  add(req, res) {
    const { body } = req;
    const urlImgName = this.getUrlImg(req);
    const item = new Items({ ...body, imagen: urlImgName[0] });
    return valid(itemsValidation.post(), body)
      .then(() => item.save())
      .then((itemCreated) => this.saveImg(req, urlImgName[1])
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
            imagen: item.imagen
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

  nameImg(name) {
    const lowerCase = name.toLowerCase();
    const array = lowerCase.split(/\s+|,/gi);
    return array.join('-');
  }

  getUrlImg(req) {
    const { protocol, headers: { host }, body } = req;
    const nameImg = `${this.nameImg(
      `${req.body.name}-${new Date().toGMTString()}`
    )}.jpg`;
    return [`${protocol}://${host}/items/${body.sellerId}/${nameImg}`, nameImg];
  }

  saveImg(req, nameImg) {
    const { imagen, sellerId } = req.body;
    const base64Image = imagen.split(';base64,').pop();
    const dir = `img/${sellerId}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    return prom.writeFile(
      `${dir}/${nameImg}`,
      base64Image,
      { encoding: 'base64' }
    );
  }
}

module.exports = ItemsController;
