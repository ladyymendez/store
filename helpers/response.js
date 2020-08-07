/* eslint-disable class-methods-use-this */
const { logger } = require('../shared');

class Log {
  sendSuccess(data, req, res) {
    // console.log('@@', data, req.url);
    let response = {};
    // data.nModified === 0
    // if (!data || data.deletedCount === 0) {
    //   logger.error(`ID not found in ${req.method}, url ${req.url}`);
    //   return res.status(404).json({ message: 'resource not found' });
    // }
    // if (data === null) {
    //   logger.error(`ID not found in ${req.method}, url ${req.url}`);
    //   return res.status(404).json({ message: 'Resource not found' });
    // }
    if (req.method === 'POST' && req.url === '/register') {
      response = { message: 'Register Successful' };
    }
    if (req.method === 'PUT' && /\users\b/.test(req.url)) {
      response = { message: 'Updated Successful' };
    }
    if (req.method === 'DELETE') {
      response = { message: 'Deleted Successful' };
    }
    if (Object.keys(response).length === 0) response = data;
    return res.status(200).json(response);
  }

  sendError(res, stat, err) {
    const msg = { message: err.message || err };

    // if (err.kind === 'ObjectId') {
    //   msg.message = 'Error Id';
    // }
    if (err.code === 11000) {
      msg.message = 'Register Unsuccessful';
    }
    if (msg.message === 'Login Unsuccessful!') {
      return res.status(401).json(msg);
    }
    if (msg.message === 'Not found') {
      return res.status(404).json({ message: 'Resource not found' });
    }

    logger.error(`Error on the server, ${msg.message}`);
    return res.status(stat).json(msg);
  }
}

module.exports = Log;
