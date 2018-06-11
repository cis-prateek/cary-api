/**
 * CategoryController
 *
 * @description :: Server-side logic for managing Categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  addCategory: (req, res) => {
    categoryService.addCategory(req, res);
  },
  getActiveCategories: (req, res) => {
    categoryService.getActiveCategories(req, res);
  },
  getActiveSubCategories: (req, res) => {
    categoryService.getActiveSubCategories(req, res);
  },
  getActiveCategoryWithTags: (req, res) => {
    categoryService.getActiveCategoryWithTags(req, res);
  },
  getAllCategories: (req, res) => {
    categoryService.getAllCategories(req, res);
  },
  getAllSubCategories: (req, res) => {
    categoryService.getAllSubCategories(req, res);
  },
  getAllCategoryWithTags: (req, res) => {
    categoryService.getAllCategoryWithTags(req, res);
  },
  getCategoryProviders: (req, res) => {
    categoryService.getCategoryProviders(req, res);
  },
  updateCategory: (req, res) => {
    categoryService.updateCategory(req, res);
  },
  deleteById: (req, res) => {
    categoryService.deleteById(req, res);
  },
  getUserActiveCategories: (req, res) => {
    categoryService.getUserActiveCategories(req, res);
  },
  getUserActiveSubCategories: (req, res) =>{
    categoryService.getUserActiveSubCategories(req, res);
  },
  getCategoryById: (req, res) =>{
    categoryService.getCategoryById(req, res);
  }

};
