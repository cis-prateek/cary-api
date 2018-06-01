/**
 * ProvidersController
 *
 * @description :: Server-side logic for managing providers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getTopProviders: (req, res) => {
    providerService.getTopProviders(req, res);
  },
  getProviderById: (req, res) => {
    providerService.getProviderById(req, res);
  },
  getAllProviders: (req, res) => {
    providerService.getAllProviders(req, res);
  }
};
