/**
 * OTP.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    phoneNumber: {
      type: 'integer',
      required: true,
      unique: true
    },
    otp: {
      type: 'integer',
      required: true
    },
    type: {
      type: 'string',
      enum: ['forgot-pass', 'registration'],
      defaultsTo: 'registration'
    }
  }
};
