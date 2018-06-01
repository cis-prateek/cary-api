var bcrypt = require('bcrypt');
var _ = require('lodash');

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
      defaultsTo: 'user'
    },

    phoneNumber: {
      type: 'string',
      unique: true,
      required: true
    },

    // provider or seeker.
    isProvider: {
      type: 'boolean',
      defaultsTo: false
    },

    profile: {
      model: 'Profile'
    },

    userProfile: {
      collection: 'Profile',
      via: 'userId'
    },

    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;

      return obj;
    },
    checkPasswordMatch: async (oldPassword, user) => {
      let reponse;
      try {
        response = await bcrypt.compare(oldPassword, user.password);

        return response;
      }
      catch (e) {
        return false;
      }
    },
    getPassword: async () => {
      let reponse;

      try {
        response = await bcrypt.compare(oldPassword, user.password);

        return response;
      }
      catch (e) {
        return false;
      }
    },
    myCategories: async function () {
      const res = await UsersCategories.findOne()
        .where({
          user_id: this.id
        });
      const response = await _.map(res.categories, (val) => {
        return val.category_id;
      });

      return response;
    },

    mySubCategories: async function () {
      const res = await UsersCategories.findOne()
        .where({
          user_id: this.id
        });
      response = [];
      _.forEach(res, (val) => {
        response = response.concat(val.tags);
      });

      return response;
    }
  },

  beforeCreate: function (user, cb) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          cb(err);
        } else {
          user.password = hash;
          cb();
        }
      });
    });
  },
  beforeUpdate: function (user, cb) {
    if (user.password) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) {
            cb(err);
          } else {
            user.password = hash;
            cb();
          }
        });
      });
    } else {
      cb();
    }
  },
  afterCreate: function (user, cb) {
    Profile.create({
      userId: user.id,
      phoneNumber: user.phoneNumber
    }, (err, user) => {
      if (err) {
        cb(err);
      } else {
        cb();
      }
    });
  }
};
