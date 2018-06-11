/**
 * ProductNeedComment.js
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

    productNeedId: {
      model: 'ProductNeed',
      required: true
    },

    createdBy: {
      model: 'User',
      required: true
    },

    providerProfile: async function () {
      const res = await Profile.findOne()
        .where({
          id: this.createdBy
        });

      return res;
    }
  }
};
