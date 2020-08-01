const express = require('express');
const { port } = require('config');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compress = require('compression');
const expressRoutesRegistrar = require('express-routes-registrar');
const { logger } = require('../shared');
// const { jwtCheck } = require('../middleware/auth');

const app = express();

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  morgan(
    'combined',
    { stream: { write: (message) => logger.info(message.trim()) } }
  )
);

app.use(compress());
// app.use('*', jwtCheck.unless({ path: ['/users/register'] }));
app.use(helmet());
app.use(cors());

const setup = (controllers, routes) => {
  expressRoutesRegistrar(app)
    .register(routes, controllers);
};

const start = () => app.listen(port, () => {
  logger.info('Express server started on port 3000');
});

const stop = () => app.close();

module.exports = { start, stop, setup };
