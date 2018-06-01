/**
 * QuatationsController
 *
 * @description :: Server-side logic for managing quatations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  addQuatation: (req, res) => {
    quatationService.addQuatation(req, res);
  },
  getQuatation: (req, res) => {
    quatationService.getQuatation(req, res);
  },
  getQuatationsByNeedId: (req, res) =>{
  	quatationService.getQuatationsByNeedId(req, res);
  },
  editQuatation: (req, res) =>{
  	quatationService.editQuatation(req, res);
  },
  providerListByNeedId: (req, res) => {
  	quatationService.providerListByNeedId(req, res);
  }

};

