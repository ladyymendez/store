const { Schema, model } = require('mongoose');

const { ObjectId } = Schema.Types;

const productSchema = Schema({
  sellerId: { type: ObjectId, required: true },
  name: { type: String, required: true },
  imagen: { type: String /* required: true */},
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  nameOfGame: { type: String, required: true },
  createAt: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = model('Item', productSchema);
