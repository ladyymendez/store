/* eslint-disable class-methods-use-this */
const { url, body } = require('config');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { UNAUTHORIZED } = require('http-status-codes');
const { Users } = require('../models');
const {
  response,
  validation: { loginValidation },
  valid
} = require('../helpers');

class LoginController {
  validUser(req, res) {
    const { email, password } = req.body;
    valid(loginValidation, req.body)
      .then(() => Users.findOne({ email }))
      .then((user) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          return user;
        }
        throw new Error('Login Unsuccessful!');
      })
      .then(({ _id }) => this.token()
        .then(({ data }) => {
          const token = { ...data };
          token.userid = _id;
          return token;
        }))
      .then((data) => response.sendSuccess(data, req, res))
      .catch((error) => response.sendError(res, UNAUTHORIZED, error.message));
  }

  token() {
    return axios.post(url, body, {
      headers: { 'content-type': 'application/json' }
    });
  }
}

module.exports = LoginController;
