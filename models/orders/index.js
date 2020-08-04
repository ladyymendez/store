const { Schema, model, Types } = require('mongoose');

const { ObjectId } = Schema.Types;

const OrderSchema = Schema({
  userId: { type: ObjectId, required: true },
  items: { type: Array, required: true },
  grandTotal: { type: Number, required: true },
  // billingAddress: {
  //   cp: { type: Number, required: true },
  //   street: { type: String, required: true },
  //   state: { type: String, required: true }
  // },
  paymentMethod: { type: String, default: '"Pago contra entrega"' },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

OrderSchema.statics = {
  getSoldByUser(id) {
    return this.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.idSeller': Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $project: {
          'userInfo.password': 0,
          'userInfo.email': 0,
          'userInfo.cart': 0,
          'userInfo.addresses': 0,
          'userInfo.createdAt': 0
        }
      },
      {
        $group: {
          _id: '$_id',
          sold: { $push: '$items' },
          buyer: { $first: '$userInfo' }
        }
      }
    ]);
  }
};

module.exports = model('order', OrderSchema);
