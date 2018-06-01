var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport
  .deserializeUser(function (id, done) {
    User.findOneById(id, function (err, user) {
      if (err || user) {
        done(err, user);
      } else {
        Admin.findOneById(id, (errAdmin, admin) => {
          done(errAdmin, admin);
        });
      }
    });
  });

passport
  .use(new LocalStrategy({
    usernameField: 'phoneNumber',
    passwordField: 'password'
  }, async (userName, password, done) => {
    try {
      if (/^\d+$/.test(userName)) {
        User.findOne({
          phoneNumber: userName // user login with userName.
        }, (err, user) => {
          if (err) { return done(err); }
          if (!user) {
            return done(null, null, {
              message: 'Incorrect phoneNumber.'
            });
          } else {
            __checkPassword(password, user, done);
          }
        });
      } else {
        Admin.findOne({
          email: userName // admin login with userName.
        }, (err, user) => {
          if (err) { return done(err); }
          if (!user) {
            return done(null, null, {
              message: 'Incorrect phoneNumber.'
            });
          } else {
            __checkPassword(password, user, done);
          }
        });
      }
    }
    catch (e) {
      return done(null, null, {
        message: 'Incorrect phoneNumber.'
      });
    }
  }
  ));

const __checkPassword = (password, user, done) => {
  try {
    bcrypt.compare(password, user.password, (err, res) => {
      if (!res) {
        return done(null, null, {
          message: 'Invalid Password'
        });
      }

      return done(null, user, {
        message: 'Logged In Successfully'
      });
    });
  }
  catch (e) {
    return done(null, null, {
      message: 'Invalid Password'
    });
  }
};
