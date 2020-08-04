const UsersController = require('./usersController');
const LoginController = require('./loginController');
const ItemsController = require('./itemsController');
const CartController = require('./cartController');
const OrdersController = require('./ordersController');
const InventoryController = require('./inventoryController');

module.exports = {
  usersController: new UsersController(),
  loginController: new LoginController(),
  itemsController: new ItemsController(),
  cartController: new CartController(),
  ordersController: new OrdersController(),
  inventoryController: new InventoryController(),
};
