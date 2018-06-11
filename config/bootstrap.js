/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
const adminEmail = require('./env/production').adminEmail;
module.exports.bootstrap = (cb) => {
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  // process.on('uncaughtException', (err) => {
  //   console.log("bootstrap uncaughtException >>>>>>>",err)
  // })

  // create default admin
  Admin.findOne({
    email: adminEmail
  }, (err, adminData) => {
    if (err) {
      console.log('Error--------', err);
    } else {
      if (!adminData) {
        // insert default admin
        Admin.create({
          password: '$2a$10$kSmfKU3WTkFZ79aM5GBW3.kb2T1SFivO7iVdBFA4vpTspwAyN/EAm', email: adminEmail,
          type: 'admin',
          name: 'Master',
          phonenumber: '1234567890'
        }, (err, insert) => {
          if (err) {
            console.log('Not added default admin data', err);
          } else {
            console.log('Added default admin');
          }
        });
      }

    }
  });

  return cb();
};
