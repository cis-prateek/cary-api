/**
 * QAs.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    questions: {
      type: 'Array',
      required: true
    },

    categoryId: {
      model: 'Category',
      required: true
    },

    createdBy: {
      model: 'User',
      required: true
    }
  }
};
