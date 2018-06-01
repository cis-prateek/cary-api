module.exports = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    return res.status(503).json({
      'message': 'Service is not available as user is not authenticated.'
    });
  }
};
