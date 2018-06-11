/**
 * OrdersController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  createDumyOrder: (req, res) => {
    ordersService.createDumyOrder(req, res);
  },
  saveOrder: (req, res) => {
    ordersService.saveOrder(req, res);
  },
  getOwnOrdersByUserId: (req, res) => {
    ordersService.getOwnOrdersByUserId(req, res);
  },
  getAllOrders: (req, res) => {
    ordersService.getAllOrders(req, res);
  },
  getOrder: (req, res) => {
    ordersService.getOrder(req, res);
  },
  uploadOrderImages: (req, res) => {
    ordersService.uploadOrderImages(req, res);
  },
  removeOrderImages: (req, res) => {
    ordersService.removeOrderImages(req, res);
  },
  duePaymentsOrder: (req, res) => {
    ordersService.duePaymentsOrder(req, res);
  }

};
