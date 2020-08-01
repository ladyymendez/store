const db = require('./mongodb');
const server = require('./server');
const routes = require('./routes');
const controller = require('./controllers');
const { logger } = require('./shared');

db.connect()
  .then(() => server.start())
  .then(() => server.setup(controller, routes))
  .catch((error) => logger.error(error));
