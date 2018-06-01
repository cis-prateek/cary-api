/**
 * ProfileController
 *
 * @description :: Server-side logic for managing Profiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  updateProfile: (req, res) => {
    profileService.updateProfile(req, res);
  },
  getProfile: (req, res) => {
    profileService.getProfile(req, res);
  },
  getUserProfileById: (req, res) => {
    profileService.getUserProfileById(req, res);
  },
  uploadPortfolio: function (req, res) {
    profileService.uploadPortfolio(req, res);
  },
  removePortfolio: function (req, res) {
    profileService.removePortfolio(req, res);
  },
  checkSubRegistration: function (req, res) {
    profileService.checkSubRegistration(req, res);
  },
  getAdminProfile: (req, res) => {
    profileService.getAdminProfile(req, res);
  }
};
