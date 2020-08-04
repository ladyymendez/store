const { Schema, model } = require('mongoose');

const { ObjectId } = Schema.Types;

const userSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  addresses: [{
    _id: false,
    cp: { type: Number, required: true },
    street: { type: String, required: true },
    state: { type: String, required: true },
    default: { type: Boolean, require: true }
  }],
  cart: [{
    _id: false,
    idItem: { type: ObjectId, required: true },
    quantity: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = model('User', userSchema);
