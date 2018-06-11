/**
 * ProductNeedController
 *
 * @description :: Server-side logic for managing Productneeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  addNeeds: function (req, res) {
    productNeedService.addNeeds(req, res);
  },
  getNeeds: function (req, res) {
    productNeedService.getNeeds(req, res);
  },
  getNeedById: function (req, res) {
    productNeedService.getNeedById(req, res);
  },
  editNeed: function (req, res) {
    productNeedService.editNeed(req, res);
  },
  getOwnNeeds: function (req, res) {
    productNeedService.getOwnNeeds(req, res);
  },
  getNeedByIdWithAgreement: function (req, res) {
    productNeedService.getNeedByIdWithAgreement(req, res);
  },
  getQuatationsBySeeker: function (req, res) {
    productNeedService.getQuatationsBySeeker(req, res);
  },

  getQatationByProvider: function (req, res){
    productNeedService.getQatationByProvider(req, res);
  }

};

