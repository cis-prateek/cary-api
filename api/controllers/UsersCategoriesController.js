/**
 * UsersCategoriesController
 *
 * @description :: Server-side logic for managing Userscategories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  saveUserCategoriesWithTags: function (req, res) {
    UsersCategoriesService.saveUserCategoriesWithTags(req, res);
  },
  getUserCategoriesWithSubCategories: function (req, res) {
    UsersCategoriesService.getUserCategoriesWithSubCategories(req, res);
  }
};
