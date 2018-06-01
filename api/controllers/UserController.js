/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  uploadAvatar: (req, res) => {
    userService.uploadAvatar(req, res);
  },

  getAvatar: (req, res) => {
    userService.avatar(req, res);
  },
  getAllUsers: (req, res) => {
    userService.getAllUsers(req, res);
  },
  changePassword: (req, res) => {
    userService.changePassword(req, res);
  }
};
