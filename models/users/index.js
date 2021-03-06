const { Schema, model, Types } = require('mongoose');

const { ObjectId } = Schema.Types;

const userSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  addresses: [{
    cp: { type: Number, required: true },
    street: { type: String, required: true },
    state: { type: String, required: true },
    default: { type: Boolean, require: true }
  }],
  cart: [{
    _id: false,
    idItem: { type: ObjectId, required: true },
    idSeller: { type: ObjectId, required: true },
    quantity: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

userSchema.statics = {
  findId(id) {
    return this.findOne({ _id: id }, { password: 0 })
      .then((user) => ((user) || Promise.reject({ message: 'Not found' })));
  },

  getCart(id) {
    return this.aggregate([
      { $match: { _id: Types.ObjectId(id) } },
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
    ]);
  },

  getItem(itemid, userid) {
    return this.aggregate([
      { $match: { _id: Types.ObjectId(userid) } },
      { $unwind: '$cart' },
      { $match: { 'cart.idItem': Types.ObjectId(itemid) } },
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
    ]);
  }
};

module.exports = model('User', userSchema);
