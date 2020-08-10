const chai = require('chai');
const express = require('express');
const chaiHttp = require('chai-http');
const expressRoutesRegistrar = require('express-routes-registrar');
const {
  OK,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} = require('http-status-codes');

const db = require('../mongodb');
const { ordersRoutes } = require('../routes');
const { ordersController } = require('../controllers');
const { Items, Users } = require('../models');
const { itemsMock, usersMock } = require('./mock');

const { expect } = chai;

chai.use(chaiHttp);

describe('Orders Routes', () => {
  const app = express();
  app.use(express.json());
  const registrar = expressRoutesRegistrar(app);
  const requester = chai.request(app).keepOpen();
  let userId = null;
  let itemId = null;

  before((done) => {
    db.connect()
      .then(() => registrar.registerRoutesJson(
        ordersRoutes,
        ordersController
      ))
      .then(() => done());
  });

  before((done) => {
    Items.deleteMany({})
      .then(() => Users.deleteMany({}))
      .then(() => Items.insertMany(itemsMock))
      .then(() => Users.insertMany(usersMock))
      .then(() => Users.findOne().then(({ _id }) => {
        userId = _id;
      })
        .then(() => Items.findOne().then(({ _id }) => {
          itemId = _id;
        }))
        .then(() => Users.updateOne(
          {
            _id: userId
          },
          { $push: { cart: { idItem: itemId, quantity: 3 } } }
        )))
      .then(() => done());
  });

  after((done) => {
    db.close()
      .then(() => requester.close())
      .then(() => done());
  });

  describe('Create order /orders', () => {
    it('should create order by userid', () => (
      requester
        .post('/orders')
        .send({ userid: userId })
        .then(({ body, statusCode }) => {
          expect(body).to.have.all.keys(
            '_id',
            'items',
            'paymentMethod',
            'userId',
            'createdAt',
            'grandTotal'
          );
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Order not found id /items/', () => {
    it('POST should return 404', () => (
      requester
        .post('/orders')
        .send({ userid: '111111111111' })
        .then(({ statusCode, body }) => {
          expect(body).eql({ message: 'Resource not found' });
          expect(statusCode).to.equal(NOT_FOUND);
        })
    ));
  });

  describe('Error on the server if missing or wrong fields', () => {
    it('Create should return 500', () => (
      requester
        .post('/orders')
        .send({ userid: 123 })
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
  });
});
