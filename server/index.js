const express = require('express');
const { port } = require('config');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compress = require('compression');
const expressRoutesRegistrar = require('express-routes-registrar');
const { logger } = require('../shared');
const { jwtCheck } = require('../middleware/auth');

const app = express();

app.disable('x-powered-by');
app.enable('trust proxy');
// app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(
  morgan(
    'combined',
    { stream: { write: (message) => logger.info(message.trim()) } }
  )
);

app.use(compress());
app.use(helmet());
app.use(cors());

app.use('*', jwtCheck.unless({ path: ['/register', '/login'] }));
app.use('/items', express.static(`${process.cwd()}/img`));

const setup = (controllers, routes) => {
  expressRoutesRegistrar(app)
    .register(routes, controllers);
};

const start = () => app.listen(process.env.PORT || port, () => {
  logger.info(`Express server started on port ${process.env.PORT || port}`);
});

const stop = () => app.close();

module.exports = { start, stop, setup };
