/**
 * Profile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    userId: {
      model: 'User',
      required: true
    },

    email: {
      type: 'email',
      unique: true
    },

    phoneNumber: {
      type: 'string',
      unique: true
    },

    name: {
      type: 'string',
      defaultsTo: ''
    },

    nick_name: {
      type: 'string',
      defaultsTo: ''
    },

    address: {
      type: 'string',
      defaultsTo: ''
    },

    city: {
      type: 'string',
      defaultsTo: ''
    },

    country: {
      type: 'string',
      defaultsTo: ''
    },

    paypal_account: {
      type: 'string',
      defaultsTo: ''
    },

    desc: {
      type: 'string',
      defaultsTo: ''
    },

    additional_info: {
      type: 'string',
      defaultsTo: ''
    },

    portfolioImages: {
      type: 'Array',
      defaultsTo: []
    },

    unique_quality: {
      type: 'string',
      defaultsTo: ''
    },

    avatarUrl: {
      type: 'string',
      defaultsTo: null
    },

    avatarFd: {
      type: 'string',
      defaultsTo: null
    },

    avatarId: {
      type: 'string',
      defaultsTo: null
    }
  }
};
