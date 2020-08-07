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
const { itemsRoutes } = require('../routes');
const { itemsController } = require('../controllers');
const { Items } = require('../models');
const { redEyes } = require('./img');

const { expect } = chai;

chai.use(chaiHttp);

describe('Items Routes', () => {
  const app = express();
  app.use(express.json());
  const registrar = expressRoutesRegistrar(app);
  let ID = null;
  const requester = chai.request(app).keepOpen();

  before((done) => {
    db.connect()
      .then(() => registrar.registerRoutesJson(
        itemsRoutes,
        itemsController
      ))
      .then(() => done());
  });

  before((done) => {
    Items.deleteMany({})
      .then(() => done());
  });

  after((done) => {
    db.close()
      .then(() => requester.close())
      .then(() => done());
  });

  describe('Create Item /items', () => {
    it(`save a new item (
      sellerId, name, price, quantity, attribute,
      description, nameOfGame, imagen)`, () => (
      requester
        .post('/items')
        .send({
          sellerId: '5f29aa77ca76e9494b20b492',
          name: 'Dragón Toon de Ojos Rojos',
          price: 190,
          quantity: 100,
          attribute: 'Oscuridad',
          description: 'No puede atacar en el turno en el que es Invocado.',
          nameOfGame: 'yugioh',
          imagen: redEyes
        })
        .then(({ body, statusCode }) => {
          const { _id } = body;
          ID = _id;
          expect(body).to.have.all.keys(
            '_id',
            'sellerId',
            'name',
            'price',
            'quantity',
            'attribute',
            'description',
            'nameOfGame',
            'imagen',
            'createAt'
          );
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Read /items/:id', () => {
    it('should return an item by id', () => (
      requester
        .get(`/items/${ID}`)
        .then(({ body, statusCode }) => {
          expect(body).to.an('object');
          expect(body).to.have.all.keys(
            '_id',
            'sellerId',
            'name',
            'price',
            'quantity',
            'attribute',
            'description',
            'nameOfGame',
            'imagen',
            'createAt'
          );
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Update /items/:id', () => {
    it('should update an items by id', () => (
      requester
        .put(`/items/${ID}`)
        .send({ name: 'Dragón Toon de Ojos Rojos v2' })
        .then(({ statusCode, body }) => {
          expect(body).to.include({ name: 'Dragón Toon de Ojos Rojos v2' });
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Delete /items/:id', () => {
    it('should delete an item by id', () => (
      requester
        .delete(`/items/${ID}`)
        .then(({ statusCode, body }) => {
          expect(body).to.an('object').eql({ message: 'Deleted Successful' });
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Items not found by id /items/:id', () => {
    it('Read should return 404', () => (
      requester
        .get('/items/123456789111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(NOT_FOUND);
        })
    ));
    it('Put should return 404', () => (
      requester
        .put('/items/123456789111')
        .send({ name: 'Dragón Toon' })
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(NOT_FOUND);
        })
    ));
    it('Delete should return 404', () => (
      requester
        .delete('/items/123456789111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(NOT_FOUND);
        })
    ));
  });

  describe('Error on the server if missing or wrong fields', () => {
    it('Read should return 500', () => (
      requester
        .get('/items/1111111111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
    it('Put should return 500', () => (
      requester
        .put('/items/1111111111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
    it('Delete should return 500', () => (
      requester
        .delete('/items/1111111111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
    it('error to save a new item without parameters', () => (
      requester
        .post('/items')
        .send({ })
        .then(({ statusCode, body: { message } }) => {
          expect(message).to.match(/(is required)/);
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
  });
});
