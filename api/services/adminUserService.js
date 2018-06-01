const _ = require('lodash');
const bCrypt = require('bcrypt');
const passport = require('passport');

exports.updateAdminUser = (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const phonenumber = req.body.phonenumber;
  Admin.findOne(
    {
      'email': email
    }, async function (err, user) {
      if (user) {
        user.name = name;
        user.phonenumber = phonenumber;
        Admin.update(user.id, user)
          .exec(function (err, user) {
            if (err) {
              res.json(403, {
                result: 0,
                message: 'Error occurs',
                error: err
              });
            } else {
              return res.json(200, {
                result: 1,
                data: user
              });
            }
          });
      }
    });
};

exports.addAdminUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Admin.findOne(
    {
      'email': email
    }, async function (err, user) {
      // In case of any error return
      if (err) {
        res.json(403, {
          result: 0,
          message: 'Error occurs',
          error: err
        });
      }
      // already exists
      if (user) {
        console.log('User already exists');
        res.json(403, {
          result: 0,
          message: 'User Already Exists',
          error: err
        });
      } else {
        // if there is no user with that email
        // create the user
        var newUser = {
        };
        // set the user's local credentials
        newUser = {
          email,
          password: await createHash(password),
          name: req.body.name,
          phonenumber: req.body.phonenumber
        };

        // save the user
        Admin.create(newUser)
          .exec(function (err, admin) {
            if (err) {
              res.json(403, {
                result: 0,
                message: 'Error occurs',
                error: err
              });
            } else {
              return res.json(200, {
                result: 1,
                data: admin
              });
            }
          });
      }
    });
};

var createHash = async function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

exports.getAllAdminUser = async (req, res) => {
  let response;
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({
        result: 0,
        message: 'Not Authrized'
      });
    }
    response = await Admin.find();
  }
  catch (e) {

    return res.status(503).json({
      result: 0,
      message: 'Server Error'
    });
  }

  return res.status(201).json({
    result: 1,
    data: response
  });
};

exports.deleteAdminUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Admin.findOneById(userId);
    if (!user) {
      return res.status(403).json({
        result: 0,
        message: 'Invailid user Id.'
      });
    }
    Admin.destroy(userId).exec(function (err, news) {
      if (err) {
        return res.json(403, {
          result: 0,
          message: 'Error occurs',
          error: err
        });
      } else {
        return res.json(200, {
          result: 1
        });
      }
    });
  } catch (e) {
    return res.status(403).json({
      result: 1,
      error: e,
      message: 'Error occurs.'
    });
  }
};

