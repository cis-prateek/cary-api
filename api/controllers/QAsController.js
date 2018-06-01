/**
 * QAsController
 *
 * @description :: Server-side logic for managing Qas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  saveQuestions: (req, res) => {
    QAService.saveQuestions(req, res);
  },
  saveAnswer: (req, res) => {
    QAService.saveAnswer(req, res);
  },
  getAllQuestions: (req, res) => {
    QAService.getAllQuestions(req, res);
  },
  getQuestionById: (req, res) => {
    QAService.getQuestionById(req, res);
  },
  getAnswersByQuestionId: (req, res) => {
    QAService.getAnswersByQuestionId(req, res);
  },
  getQuestionAnswerByQuestionBunchId: (req, res) => {
    QAService.getQuestionAnswerByQuestionBunchId(req, res);
  },
  getAllQuestionsBySelectedCategories: (req, res) => {
    QAService.getAllQuestionsBySelectedCategories(req, res);
  },
  getQuestionWithAnswersBySelectedCategories: (req, res) => {
    QAService.getQuestionWithAnswersBySelectedCategories(req, res);
  }
};
