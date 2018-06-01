/**
 * ProductNeedCommentController
 *
 * @description :: Server-side logic for managing Productneedcomments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  addNeedsComment: (req, res) => {
    productNeedCommentService.addNeedsComment(req, res);
  },
  getProvidersListWithNeedsCommentsCounts: (req, res) => {
    productNeedCommentService.getProvidersListWithNeedsCommentsCounts(req, res);
  },
  getNeedsCommentByNeedAndProviderId: (req, res) => {
    productNeedCommentService.getNeedsCommentByNeedAndProviderId(req, res);
  },
  editNeedsComment: (req, res) => {
    productNeedCommentService.editNeedsComment(req, res);
  }
};
