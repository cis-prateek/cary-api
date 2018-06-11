/**
 * SliderImage.js
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
    description: {
      type: 'string',
      defaultsTo: ''
    },
    title_ch: {
      type: 'string',
      required: true
    },
    description_ch: {
      type: 'string',
      defaultsTo: ''
    },
    cloudId: {
      type: 'string',
      required: true
    },
    url: {
      type: 'string',
      required: true
    }
  }
};
