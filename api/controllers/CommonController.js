/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getSeekersCount: (req, res) => {
    commonService.getSeekersCount(req, res);
  },
  getProvidersCount: (req, res) => {
    commonService.getProvidersCount(req, res);
  },
  getTransactionsCount: (req, res) => {
    commonService.getTransactionsCount(req, res);
  },
  getCounts: (req, res) => {
    commonService.getCounts(req, res);
  }
};
