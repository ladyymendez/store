const chai = require('chai');
const express = require('express');
const chaiHttp = require('chai-http');
const expressRoutesRegistrar = require('express-routes-registrar');
const {
  OK,
  INTERNAL_SERVER_ERROR
} = require('http-status-codes');

const db = require('../mongodb');
const { historyRoutes } = require('../routes');
const { historyController } = require('../controllers');

const { expect } = chai;

chai.use(chaiHttp);

describe('History Routes', () => {
  const app = express();
  app.use(express.json());
  const registrar = expressRoutesRegistrar(app);
  const requester = chai.request(app).keepOpen();

  before((done) => {
    db.connect()
      .then(() => registrar.registerRoutesJson(
        historyRoutes,
        historyController
      ))
      .then(() => done());
  });

  after((done) => {
    db.close()
      .then(() => requester.close())
      .then(() => done());
  });

  describe('Read purchase orders /history/shopping/:userid', () => {
    it('should get purchase orders by userid', () => (
      requester
        .get('/history/shopping/5f31a5571e24178a4db805fc')
        .then(({ body, statusCode }) => {
          expect(body[0]).to.have.all.keys(
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

  describe('Read sales orders /history/sales/', () => {
    it('should return an array of items', () => (
      requester
        .get('/history/sales/5f29aa77ca76e9494b20b492')
        .then(({ body, statusCode }) => {
          expect(body[0]).to.have.all.keys(
            '_id',
            'buyer',
            'sold'
          );
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Error on the server if missing or wrong fields', () => {
    it('Read should return 500 /history/sales/:id', () => (
      requester
        .get('/history/sales/111111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
  });
});
