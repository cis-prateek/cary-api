/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  addAdminUser: (req, res) => {
    adminUserService.addAdminUser(req, res);
  },
  getAllAdminUser: (req, res) => {
    adminUserService.getAllAdminUser(req, res);
  },
  deleteAdminUser: (req, res) => {
    adminUserService.deleteAdminUser(req, res);
  },
  updateAdminUser: (req, res) => {
    adminUserService.updateAdminUser(req, res);
  }
};
