const UsersController = require('./usersController');
const ItemsController = require('./itemsController');
const CartController = require('./cartController');
const OrdersController = require('./ordersController');
const InventoryController = require('./inventoryController');
const HistoryController = require('./historyController');

module.exports = {
  usersController: new UsersController(),
  itemsController: new ItemsController(),
  cartController: new CartController(),
  ordersController: new OrdersController(),
  inventoryController: new InventoryController(),
  historyController: new HistoryController()
};
