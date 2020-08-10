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
const { cartRoutes } = require('../routes');
const { cartController } = require('../controllers');
const { Users, Items } = require('../models');
const { usersMock, itemsMock } = require('./mock');

const { expect } = chai;

chai.use(chaiHttp);

describe('Cart Routes', () => {
  const app = express();
  app.use(express.json());
  const registrar = expressRoutesRegistrar(app);
  const requester = chai.request(app).keepOpen();
  let idUser = null;
  let idItem = null;

  before((done) => {
    db.connect()
      .then(() => registrar.registerRoutesJson(
        cartRoutes,
        cartController
      ))
      .then(() => done());
  });

  before((done) => {
    Users.deleteMany({})
      .then(() => Items.deleteMany({}))
      .then(() => Users.insertMany(usersMock))
      .then(() => Items.insertMany(itemsMock))
      .then(() => done());
  });

  after((done) => {
    db.close()
      .then(() => requester.close())
      .then(() => done());
  });

  describe('Add items to cart /cart', () => {
    before(() => (
      Users.findOne().then(({ _id }) => {
        idUser = _id;
      })
        .then(() => Items.findOne().then(({ _id }) => {
          idItem = _id;
        }))
    ));
    it('should return item added', () => (
      requester
        .post('/cart')
        .send({ userid: idUser, itemid: idItem, quantity: 2 })
        .then(({ body, statusCode }) => {
          expect(body[0]).to.have.all.keys('_id', 'shoppingCart');
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Read cart by user /cart/:id', () => {
    it('should return an array of items added to shopping cart', () => (
      requester
        .get(`/cart/${idUser}`)
        .then(({ body, statusCode }) => {
          expect(body[0]).to.have.all.keys('_id', 'shoppingCart');
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Update cart item by user /cart/:id', () => {
    it('should return item updated', () => (
      requester
        .put(`/cart/${idUser}`)
        .send({ itemid: idItem, quantity: 8 })
        .then(({ body, statusCode }) => {
          expect(body[0]).to.have.all.keys('_id', 'shoppingCart');
          expect(body[0].shoppingCart[0]).to.include({ quantity: 8 });
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Delete item by user /cart/:id', () => {
    it('should delete an item by id user', () => (
      requester
        .delete(`/cart/${idUser}`)
        .send({ itemid: idItem })
        .then(({ statusCode, body }) => {
          expect(body).to.an('object').eql({ message: 'Deleted Successful' });
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Cart not found by idUser /cart/:id', () => {
    it('Read should return 404', () => (
      requester
        .get('/cart/123456789111')
        .then(({ statusCode, body }) => {
          expect(body).eql({ message: 'Resource not found' });
          expect(statusCode).to.equal(NOT_FOUND);
        })
    ));
  });

  describe('Error on the server if missing or wrong fields', () => {
    it('POST should return 500', () => (
      requester
        .post('/cart')
        .send({})
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
    it('Read should return 500', () => (
      requester
        .get('/cart/111111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
    it('PUT should return 500', () => (
      requester
        .put('/cart/111111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
    it('DELETE should return 500', () => (
      requester
        .delete('/cart/111111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
  });
});
