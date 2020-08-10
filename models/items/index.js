const { Schema, model } = require('mongoose');

const { ObjectId } = Schema.Types;

const productSchema = Schema({
  sellerId: { type: ObjectId, required: true },
  name: { type: String, required: true },
  imagen: { type: String /* required: true */},
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  attribute: { type: String, required: true },
  description: { type: String, required: true },
  nameOfGame: { type: String, required: true },
  createAt: { type: Date, default: Date.now }
}, { versionKey: false });

productSchema.statics = {
  findId(id) {
    return this.findOne(id)
      .then((item) => ((item) || Promise.reject({ message: 'Not found' })));
  }
};

module.exports = model('Item', productSchema);
