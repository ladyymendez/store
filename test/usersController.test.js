const chai = require('chai');
const express = require('express');
const chaiHttp = require('chai-http');
const expressRoutesRegistrar = require('express-routes-registrar');
const {
  OK,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED
} = require('http-status-codes');

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

  describe('Create user /register', () => {
    it('save a new user (name, email,password)', () => (
      requester
        .post('/register')
        .send({ name: 'Laura', email: 'laura@gmail.com', password: 'laura123' })
        .then(({ body, statusCode }) => {
          expect(body).to.an('object').eql({ message: 'Register Successful' });
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Login user /login', () => {
    it('Login user (email, password)', () => (
      requester
        .post('/login')
        .send({ email: 'laura@gmail.com', password: 'laura123' })
        .then(({ body, statusCode }) => {
          ID = body.userid;
          expect(body).to.have.all.keys(
            'userid',
            'token_type',
            'expires_in',
            'access_token'
          );
          expect(statusCode).to.equal(OK);
        })
    ));
    it('error to log a user with wrong parameters', () => (
      requester
        .post('/login')
        .send({ email: 'laura@gmail.com', password: 'laura122' })
        .then(({ statusCode, body }) => {
          expect(body).to.an('object').eql({ message: 'Login Unsuccessful!' });
          expect(statusCode).to.equal(UNAUTHORIZED);
        })
    ));
  });

  describe('Read /users/:id', () => {
    it('should return an user by id', () => (
      requester
        .get(`/users/${ID}`)
        .then(({ body, statusCode }) => {
          expect(body).to.an('object');
          expect(body).to.have.all.keys(
            '_id',
            'name',
            'email',
            'addresses',
            'cart',
            'createdAt'
          );
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Read /users', () => {
    it('should return json as user list', () => (
      requester
        .get('/users')
        .then(({ body, statusCode }) => {
          expect(body).to.an('array');
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Update /users/:id', () => {
    it('should update an user by id', () => (
      requester
        .put(`/users/${ID}`)
        .send({ name: 'Katrina' })
        .then(({ statusCode, body }) => {
          expect(body).to.an('object').eql({ message: 'Updated Successful' });
          expect(statusCode).to.equal(OK);
        })
    ));
  });

  describe('Delete /users/:id', () => {
    it('should delete an user by id', () => (
      requester
        .delete(`/users/${ID}`)
        .then(({ statusCode, body }) => {
          expect(body).to.an('object').eql({ message: 'Deleted Successful' });
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
        .send({ name: 'Laura' })
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

  describe('Error on the server if missing or wrong fields', () => {
    it('Read should return 500', () => (
      requester
        .get('/users/1111111111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
    it('Put should return 500', () => (
      requester
        .put('/users/1111111111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
    it('Delete should return 500', () => (
      requester
        .delete('/users/1111111111')
        .then(({ statusCode }) => {
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
    it('error to save a new user without parameters', () => (
      requester
        .post('/register')
        .send({ })
        .then(({ statusCode, body: { message } }) => {
          expect(message).to.match(/(is required)/);
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
    it('error to login a user without parameters', () => (
      requester
        .post('/login')
        .send({ })
        .then(({ statusCode, body: { message } }) => {
          expect(message).to.match(/(is required)/);
          expect(statusCode).to.equal(INTERNAL_SERVER_ERROR);
        })
    ));
  });
});
