/* eslint-disable class-methods-use-this */
const mongoose = require('mongoose');
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { Orders, Users, Items } = require('../models');
const {
  response,
  validation: { orderValidation },
  valid
} = require('../helpers');

const { ObjectId } = mongoose.Types;

class OrdersController {
  add(req, res) {
    return valid(orderValidation.post(), req.body)
      .then(() => Users.getCart(req.body.userid))
      .then((cart) => this.substractProducts(cart[0]))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((err) => response.sendError(res, INTERNAL_SERVER_ERROR, err));
  }

  substractProducts(cart) {
    let session = null;
    const { _id, shoppingCart } = cart;
    const order = new Orders({
      userId: _id
    });
    order.items = shoppingCart.map((item) => (
      {
        idItem: ObjectId(item.idItem),
        idSeller: ObjectId(item.sellerId),
        name: item.name,
        price: item.price,
        qty: item.quantity
      }
    ));
    order.grandTotal = shoppingCart.reduce((total, item) => (
      total + item.price * item.quantity
    ), 0);

    return Items.startSession()
      .then((log) => {
        session = log;
        log.startTransaction();
        return order.save({ session });
      })
      .then(() => {
        const allProductsPromises = order.items.map((item) => (
          Items.updateOne(
            { _id: ObjectId(item.idItem) },
            { $inc: { quantity: -item.qty } }
          ).session(session)
        ));
        return Promise.all(allProductsPromises);
      })
      .then(() => (
        Users.updateOne({ _id: ObjectId(_id) }, { $set: { cart: [] } })
          .session(session)
      ))
      .then(() => session.commitTransaction())
      .then(() => session.endSession())
      .then(() => order);
  }
}

module.exports = OrdersController;
