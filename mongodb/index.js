const mongoose = require('mongoose');
const config = require('config');

const connect = () => (
  mongoose.connect(
    config.db,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
);

const close = () => (
  mongoose.connection.close()
);

module.exports = { connect, close };
