const async = require('async');

exports.getSeekersCount = (req, res) => {
  User.count({
    isProvider: false,
    type: 'user'
  }).exec((err, count) => {
    if (err) {
      res.send({
        result: 0,
        error: err,
        message: 'Error Occurs'
      });
    } else {
      res.send({
        result: 1,
        data: {
          count
        }
      });
    }
  });
};

exports.getProvidersCount = (req, res) => {
  User
    .count({
      isProvider: true,
      type: 'user'
    }).exec((err, count) => {
      if (err) {
        res.send({
          result: 0,
          error: err,
          message: 'Error Occurs'
        });
      } else {
        res.send({
          result: 1,
          data: {
            count
          }
        });
      }
    });
};

exports.getTransactionsCount = (req, res) => {
  Transaction
    .count().exec((err, count) => {
      if (err) {
        res.send({
          result: 0,
          error: err,
          message: 'Error Occurs'
        });
      } else {
        res.send({
          result: 1,
          data: {
            count
          }
        });
      }
    });
};

exports.getCounts = (req, res) => {
  let counts = {
    providers: 0,
    seekers: 0,
    transactions: 0
  };
  async.series([
    (callback1) => {
      User.count({
        isProvider: true,
        type: 'user'
      }).exec((err, proCount) => {
        if (!err) {
          counts.providers = proCount;
        }
        callback1();
      });
    },
    (callback2) => {
      User.count({
        isProvider: false,
        type: 'user'
      }).exec((err, seekCount) => {
        if (!err) {
          counts.seekers = seekCount;
        }
        callback2();
      });
    },
    (callback3) => {
      Transaction
        .count().exec((err, count) => {
          if (!err) {
            counts.transactions = count;
          }
          callback3();
        });

    }
  ], (err, response) => {
    res.send({
      result: 1,
      data: counts
    });
  });
};
