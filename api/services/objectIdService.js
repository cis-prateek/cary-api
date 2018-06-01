let str = 'sails-mongo/node_modules/mongodb';
if (sails.getBaseUrl() == 'http://localhost:1337') {
  str = 'mongodb';
}
let ObjectId = require(str).ObjectID;
exports.ObjectId = ObjectId;
