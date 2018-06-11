var passport = require('passport');
var nodemailer = require('nodemailer');
var base64 = require('base-64');
var utf8 = require('utf8');
var bcrypt = require('bcrypt');

var mainURL = require('./../../config/env/production').mainURL;
const adminEmail = require('./../../config/env/production').adminEmail;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nusrat.b@cisinlabs.com',
    pass: 'txo0Sfcvgy'
  }
});

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  login: function (req, res) {
    passport.authenticate('local', function (err, user, info) {
      if ((err) || (!user)) {
        return res.send({
          result: 0,
          message: info.message,
          data: user
        });
      }
      req.logIn(user, function (err) {
        if (err) res.send({
          result: 0,
          error: err,
          message: 'Invalid Credentials.'
        });
        req.session.user = user;

        return res.send({
          result: 1,
          message: info.message,
          data: user
        });
      });

    })(req, res);
  },

  adminLogin: function (req, res) {
    passport.authenticate('local', function (err, user, info) {
      if ((err) || (!user)) {
        return res.send({
          message: info.message,
          data: user
        });
      }
      req.logIn(user, function (err) {
        if (err) {
          res.send({
            result: 0,
            error: err,
            message: 'Invalid Credentials.'
          });
        } else if (user.type == 'admin') {
          req.session.admin = user;

          return res.send({
            result: 1,
            message: info.message,
            data: user
          });

        } else {
          return res.send({
            result: 0,
            message: 'Unauthorize access.'
          });
        }
      });
    })(req, res);
  },

  signup: function (req, res) {
    userService.signup(req, res);
  },

  logout: function (req, res) {
    req.session.user = null;
    req.logout();
    res.status(200).json({
      result: 1,
      message: 'logout successfully..'
    });
  },

  adminLogout: function (req, res) {
    req.session.admin = null;
    res.status(200).json({
      result: 1,
      message: 'logout successfully..'
    });
  },

  checkLogin: function (req, res) {
    res.json(req.session.admin ? true : false);
  },

  forgotPassword: async (req, res) => {
    let response;
    const phoneNumber = req.body.phoneNumber,
      otp = req.body.otp,
      newPassword = req.body.newPassword;
    try {
      const user = await User.findOne({
        phoneNumber
      });

      if (!user) {
        return res.status(201).json({
          result: 0,
          message: 'Phone Number doesn\'t exist.'
        });
      }

      if (!otp) {
        return res.status(201).json({
          result: 0,
          message: 'OTP code required.'
        });
      }

      const otpInfo = await OTP.findOne({
        phoneNumber,
        otp,
        type: 'forgot-pass'
      });

      if (!otpInfo) {
        return res.status(201).json({
          result: 0,
          message: 'Invalid otp.'
        });
      }

      await User.update(user.id, {
        password: newPassword
      });
      await OTP.destroy({
        phoneNumber,
        type: 'forgot-pass'
      });

    }
    catch (e) {
      return res.status(503).json({
        result: 0,
        message: 'Server Error.'
      });
    }

    return res.status(201).json({
      result: 1,
      message: 'Password changed successfully.'
    });
  },

  updateForgotPassword: async (req, res) => {
    let response;
    const code = req.body.code;
    let password;
    try {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          if (err) {
            return res.status(503).json({
              result: 0,
              message: 'Server Error : ' + err
            });
          } else {
            password = hash;
            Admin.update({
              passwordResetCode: code
            }, {
              passwordResetCode: '',
              password
            }, function (err, updated) {
              if (err) {
                return res.status(503).json({
                  result: 0,
                  message: 'Server Error : ' + err
                });
              } else {
                return res.status(201).json({
                  result: 1,
                  message: 'Updated successfully.'
                });
              }
            });
          }
        });
      });

    }
    catch (e) {
      return res.status(503).json({
        result: 0,
        message: 'Server Error.'
      });
    }
  },
  checkCodeForgotPassword: async (req, res) => {
    let response;
    const code = req.body.code;

    try {
      const user = await Admin.findOne({
        passwordResetCode: code
      });
      if (!user) {
        return res.status(201).json({
          result: 0,
          message: 'Invalid Code.'
        });
      } else {
        return res.status(201).json({
          result: 1,
          message: 'Valid Code.'
        });
      }
    }
    catch (e) {
      return res.status(503).json({
        result: 0,
        message: 'Server Error.'
      });
    }
  },
  updatepassword: async (req, res) => {
    let response;
    try {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          if (err) {
            return res.status(503).json({
              result: 0,
              message: 'Server Error : ' + err
            });
          } else {
            const password = hash;
            Admin.update({
              email: adminEmail
            }, {
              passwordResetCode: '',
              password
            }, function (err, updated) {
              if (err) {
                return res.status(503).json({
                  result: 0,
                  message: 'Server Error : ' + err
                });
              } else {
                return res.status(201).json({
                  result: 1,
                  message: 'Updated successfully.'
                });
              }
            });
          }
        });
      });
    }
    catch (e) {
      return res.status(503).json({
        result: 0,
        message: 'Server Error'
      });
    }
  },
  adminForgotPassword: async (req, res) => {
    let response;
    const email = req.body.email;
    try {
      const user = await Admin.findOne({
        email
      });
      if (!user) {
        return res.status(201).json({
          result: 0,
          message: 'Invalid Email.'
        });
      } else {
        mainURL = req.headers.origin + '/#/';
        // logic for forgot password page
        var bytes = utf8.encode(Date() + email);

        var encoded = base64.encode(bytes);
        passwordURL = mainURL + 'recoverpassword/' + encoded;

        var mailOptions = {
          from: 'carry@gmail.com',
          // to: email,
          to: user.email,
          subject: 'Passowrd recovery email.',
          html: '<p>Hi Admin,</p><p>We\'ve received request to reset your password. If you didn\'t make the request, just ignore this email. Otherwise, you can reset password using this link:</p><a color="primary" type="button" href="' + passwordURL + '" role="button" style="-webkit-backface-visibility: hidden;backface-visibility: hidden;background-color: #4CAF50;border-radius: 0; box-sizing: border-box;display: inline-block; padding: 10px;position: relative;text-align: center;text-decoration: none;text-transform: uppercase;-webkit-transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1);transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1);-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;white-space: inherit;cursor: pointer;color: #FFFFFF;font-size: 1rem;"><div style="visibility: visible;">Set New Password</div></a></br></br> ' + 'Thanks'
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            Admin.update({
              id: user.id
            }, {
              passwordResetCode: encoded
            }, function (err, updated) {
              if (err) {
                console.log('---err---', err);
              } else {
                console.log('update');
              }
            });
            console.log('Email sent: ' + info.response);
          }
        });
      }
    }
    catch (e) {
      return res.status(503).json({
        result: 0,
        message: 'Server Error.'
      });
    }

    return res.status(201).json({
      result: 1,
      message: 'Email sent successfully.'
    });
  }
};
