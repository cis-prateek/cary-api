/**
 * Profile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    title: {
      type: 'string',
      unique: true,
      minLength: 2,
      required: true
    },
    image: {
      type: 'object',
      defaultsTo: null
    },
    parentId: {
      model: 'Category',
      defaultsTo: function () {
        return null;
      }
    },
    subCategories: {
      collection: 'Category',
      via: 'parentId'
    },
    isActive: {
      type: 'boolean',
      defaultsTo: true
    }
  }
};
