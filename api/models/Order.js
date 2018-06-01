/**
 * Orders.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    productNeedId: {
      model: 'ProductNeed',
      required: true
    },
    quatationId: {
      model: 'Quatations',
      required: true
    },
    seekerId: {
      model: 'User',
      required: true
    },

    providerId: {
      model: 'User',
      required: true
    },
    paymentStatus: {
      type: 'json'
    },
    paidAmount: {
      type: 'integer'
    },
    dueMilestone: {
      type: 'string',
      enum: ['firstPayment', 'milestone1', 'milestone2', 'milestone3', 'lastPayment'],
      defaultsTo: 'firstPayment'
    },
    completionDate: {
      type: 'date'
    },
    lastPaymentDate: {
      type: 'date'
    },
    dueAmount: {
      type: 'integer'
    },
    numOfMilestore: {
      type: 'integer'
    },
    totalAmount: {
      type: 'integer'
    },
    OrderImages: {
      type: 'Array',
      defaultsTo: []
    },
    rating: {
      type: 'integer',
      defaultsTo: 0
    },
    status: {
      type: 'string',
      enum: ['Pending', 'On Going', 'Completed', 'Canceled'],
      defaultsTo: 'Pending'
    }
  },

  beforeCreate: async (order, cb) => {
    const user = await User.findOne({
      id: order.seekerId
      //isProvider: false
    });

    if (!user) {
      return cb({
        message: 'Invailid Seeker Id'
      });
    }

    const provider = await User.findOne({
      id: order.providerId
      //isProvider: true
    });

    if (!provider) {
      return cb({
        message: 'Invailid Provider Id'
      });
    }

    const productNeed = await ProductNeed.findOne({
      id: order.productNeedId
    });

    if (!productNeed) {
      return cb({
        message: 'Invailid Need Id'
      });
    }

    const quatations = await Quatations.findOneById(order.quatationId);
    if (!quatations) {
      return cb({
        message: 'Unable to place order with out valid quatation id'
      });
    }

    cb();
  },

  beforeDestroy: async (criteria, cb) => {
    const order = await Order.findOne({
      id: criteria.id,
      status: 'pending'
    });

    if (!order) {
      return cb({
        message: 'Unable to destroy order'
      });
    }
    cb();
  }
};
