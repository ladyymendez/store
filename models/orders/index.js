const { Schema, model } = require('mongoose');

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

module.exports = model('order', OrderSchema);
