module.exports = function (req, res, next) {
  if (req.isAuthenticated() && req.session.admin) {
    return next();
  }
  else {
    return res.json(503, {
      'message': 'Not authenticated.'
    });
  }
};
