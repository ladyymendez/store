const UsersController = require('./usersController');
const LoginController = require('./loginController');
const ItemsController = require('./itemsController');

module.exports = {
  usersController: new UsersController(),
  loginController: new LoginController(),
  itemsController: new ItemsController()
};
