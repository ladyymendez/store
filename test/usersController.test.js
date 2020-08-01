const chai = require('chai');
const express = require('express');
const chaiHttp = require('chai-http');
const { OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = require('http-status-codes');
const expressRoutesRegistrar = require('express-routes-registrar');
const db = require('../mongodb');
const { usersRoutes } = require('../routes');
const { usersController } = require('../controllers');
const { Users } = require('../models');

const { expect } = chai;

chai.use(chaiHttp);

describe('Users Routes', () => {
  const app = express();
  app.use(express.json());
  const registrar = expressRoutesRegistrar(app);
  let ID = null;
  const requester = chai.request(app).keepOpen();

  before((done) => {
    db.connect()
      .then(() => registrar.registerRoutesJson(
        usersRoutes,
        usersController
      ))
      .then(() => done());
  });

  before((done) => {
    Users.deleteMany({})
      .then(() => done());
  });

  after((done) => {
    db.close()
      .then(() => requester.close())
      .then(() => done());
  });

  describe('Create /users', () => {
    it('save a new user (name, type)', () => (
      requester
        .post('/users')
        .send({ name: 'LOL', type: 'employee' })
        .then(({ body, statusCode }) => {
          expect(body).to.an('object');
          expect(statusCode).to.equal(OK);
        })
    ));
    it('error to save a new user without parameters', () => (
      requester
        .post('/users')
        .send({ })
        .then(({ statusCode, body: { message: { _message } } }) => {
          expect(_message).to.equal('User validation failed');
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
  });

  describe('Read /users', () => {
    it('should return json as listo of users', () => (
      requester
        .get('/users')
        .then(({ body, statusCode }) => {
          expect(body).to.an('array');
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Read /users/:id', () => {
    before(() => (
      Users.findOne().then(({ _id }) => {
        ID = _id;
      })
    ));
    it('should return an user by id', () => (
      requester
        .get(`/users/${ID}`)
        .then(({ body, statusCode }) => {
          expect(body).to.an('object');
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Update /users/:id', () => {
    it('should update an user by id', () => (
      requester
        .put(`/users/${ID}`)
        .send({ name: 'Katrina' })
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Delete /users/:id', () => {
    it('should delete an user by id', () => (
      requester
        .delete(`/users/${ID}`)
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('User not found by id /users/:id', () => {
    it('Read should return 404', () => (
      requester
        .get('/users/123456789111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(NOT_FOUND);
        })
    ));
    it('Put should return 404', () => (
      requester
        .put('/users/123456789111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(NOT_FOUND);
        })
    ));
    it('Delete should return 404', () => (
      requester
        .delete('/users/123456789111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(NOT_FOUND);
        })
    ));
  });

  describe('Error on the server if id.length < 12 /users/:id', () => {
    it('Read should return 500', () => (
      requester
        .get('/users/123')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
    it('Put should return 500', () => (
      requester
        .put('/users/123')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
    it('Delete should return 500', () => (
      requester
        .delete('/users/123')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
  });
});
