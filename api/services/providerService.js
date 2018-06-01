exports.getTopProviders = (req, res) => {
  User.find({
    isProvider: true,
    type: 'user'
  }).populate('userProfile').limit(10).exec((err, providers) => {
    if (err) {
      res.send({
        result: 0,
        error: err,
        message: 'Error Occurs'
      });
    } else {
      res.send({
        result: 1,
        data: providers
      });
    }
  });
};

exports.getProviderById = (req, res) => {
  User.findOne({
    where: {
      'id': req.params.id,
      'isProvider': true,
      'type': 'user'
    }
  }).populate('userProfile').exec((err, provider) => {
    if (err || !provider) {
      res.send({
        result: 0,
        error: err,
        message: (err ? 'Error Occurs' : 'Provider not found.')
      });
    } else {
      res.send({
        result: 1,
        data: provider
      });
    }
  });
};

exports.getAllProviders = (req, res) => {
  User.find({
    'isProvider': true,
    'type': 'user'
  }).populate('userProfile').exec((err, provider) => {
    if (err || !provider) {
      res.send({
        result: 0,
        error: err,
        message: (err ? 'Error Occurs' : 'Provider not found.')
      });
    } else {
      res.send({
        result: 1,
        data: provider
      });
    }
  });
};
