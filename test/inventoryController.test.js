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
const { inventoryRoutes } = require('../routes');
const { inventoryController } = require('../controllers');
const { Items } = require('../models');
const { itemsMock } = require('./mock');

const { expect } = chai;

chai.use(chaiHttp);

describe('Inventory and catalog Routes', () => {
  const app = express();
  app.use(express.json());
  const registrar = expressRoutesRegistrar(app);
  const requester = chai.request(app).keepOpen();

  before((done) => {
    db.connect()
      .then(() => registrar.registerRoutesJson(
        inventoryRoutes,
        inventoryController
      ))
      .then(() => done());
  });

  before((done) => {
    Items.deleteMany({})
      .then(() => Items.insertMany(itemsMock))
      .then(() => done());
  });

  after((done) => {
    db.close()
      .then(() => requester.close())
      .then(() => done());
  });

  describe('Read inventory by seller /inventory/:id', () => {
    it('Read inventory by id', () => {
      requester
        .get('/inventory/5f29be061ae7225188f6d83d?sort=-price&word=Ciberoscuro')
        .then(({ body, statusCode }) => {
          expect(body).to.an('array');
          expect(body).to.have.length(1);
          expect(statusCode).to.equal(OK);
        });
    });
  });

  describe('Read /catalog/', () => {
    it('should return an array of items', () => (
      requester
        .get('/catalog')
        .then(({ body, statusCode }) => {
          expect(body).to.an('array');
          expect(body).to.have.length(3);
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Inventory not found by id /items/:id', () => {
    it('Read should return 404', () => (
      requester
        .get('/inventory/123456789111')
        .then(({ statusCode, body }) => {
          expect(body).eql({ message: 'Resource not found' });
          expect(statusCode).to.equal(NOT_FOUND);
        })
    ));
  });

  describe('Error on the server if missing or wrong fields', () => {
    it('Read should return 500', () => (
      requester
        .get('/inventory/111111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
  });
});
