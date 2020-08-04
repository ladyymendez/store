const UsersController = require('./usersController');
const LoginController = require('./loginController');

module.exports = {
  usersController: new UsersController(),
  loginController: new LoginController()
};
