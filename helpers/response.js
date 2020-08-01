/* eslint-disable class-methods-use-this */
const { logger } = require('../shared');

class Log {
  sendSuccess(data, req, res) {
    if (!data || data.nModified === 0 || data.deletedCount === 0) {
      logger.error(`ID not found in ${req.method}, url ${req.url}`);
      return res.status(404).json({ message: 'resource not found' });
    }
    return res.status(200).json(data);
  }

  sendError(res, stat, err) {
    const msg = { message: err };
    if (err.kind === 'ObjectId') {
      msg.message = 'Error Id';
    }
    if (err.message.search('duplicate key') !== -1) {
      msg.message = 'Register Unsuccessful';
    }
    logger.error(`Error on the server, ${msg.message}`);
    return res.status(stat).json(msg);
  }
}

module.exports = Log;
