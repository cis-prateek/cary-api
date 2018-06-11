/**
 * Admin.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
const adminEmail = require('./../../config/env/production').adminEmail;

module.exports = {

  attributes: {
    password: {
      type: 'string',
      minLength: 6,
      required: true
    },
    type: {
      type: 'string',
      required: true,
      defaultsTo: 'admin'
    },
    email: {
      type: 'string',
      unique: true,
      required: true,
      defaultsTo: adminEmail
    },
    name: {
      type: 'string',
      required: true,
      defaultsTo: ''
    },
    phonenumber: {
      type: 'string',
      required: true,
      defaultsTo: ''
    },
    avatarURL: {
      type: 'string',
      defaultsTo: ''
    },
    avatarFId: {
      type: 'string',
      defaultsTo: ''
    },
    passwordResetCode: {
      type: 'string',
      defaultsTo: ''
    },

    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      delete obj.passwordResetCode;

      return obj;
    }
  }
};
