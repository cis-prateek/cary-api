/**
 * Quatations.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    needId: {
      model: 'ProductNeed',
      required: true
    },
    parentNeedId: {
      model: 'ProductNeed'
    },
    creator: {
      model: 'User',
      required: true
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
      required: true
    },
    estimatedDay: {
      type: 'integer'
    },
    estimatedDeliveryDate: {
      type: 'date'
    },
    comment: {
      type: 'string'
    },

    isAccepted: {
      type: 'boolean',
      defaultsTo: false
    },

    isNeedModified: {
      type: 'boolean',
      defaultsTo: false
    },
    isActive: {
      type: 'boolean',
      defaultsTo: true
    },
    counter: {
      type: 'integer',
      defaultsTo: 0
    }
  }
};
