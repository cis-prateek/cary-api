/**
 * ProductNeed.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: {
      type: 'string',
      required: true
    },

    creator: {
      model: 'User',
      required: true
    },

    category: {
      model: 'Category',
      required: true
    },

    subCategories: {
      type: 'Array',
      defaultsTo: []
    },

    firstPayment: {
      type: 'integer',
      required: true
    },

    milestone1: {
      type: 'integer'
    },

    milestone2: {
      type: 'integer'
    },

    milestone3: {
      type: 'integer'
    },

    lastPayment: {
      type: 'integer',
      required: true
    },

    totalAmount: {
      type: 'integer',
      defaultsTo: 0
    },

    information: {
      type: 'string',
      required: true
    },

    scope: {
      type: 'string',
      required: true
    },

    isQuatation: {
      type: 'boolean',
      defaultsTo: false
    },

    isQuatationAccepted: {
      type: 'boolean',
      defaultsTo: false
    },

    isActive: {
      type: 'boolean',
      defaultsTo: true
    },

    parentNeed: {
      model: 'ProductNeed',
      defaultsTo: null
    },
    providerId: {
      model: 'User',
      defaultsTo: null
    },
    superParentNeed: {
      model: 'ProductNeed',
      defaultsTo: null
    },
    orderPlaceFor: {
      type: 'string',
      defaultsTo: null
    }
  }
};
