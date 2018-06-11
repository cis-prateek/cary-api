module.exports.http = {
  middleware: {

    passportInit: require('passport').initialize(),
    passportSession: require('passport').session(),
    bodyParser: require('skipper')({
      maxTimeToBuffer: 300000, maxTimeToWaitForFirstFile: 200000
    }),
    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'passportInit',
      'passportSession',
      'myRequestLogger',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ]
  }
};
