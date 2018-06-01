const _ = require('lodash');
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dqlqezsuz',
  api_key: '876992497762529',
  api_secret: 'SWWMN6ZvofwVdn9evtehTb7Gw0g'
});

exports.addNewsFeed = async (req, res) => {
  if (req.file('image')) {
    req.file('image').upload({
      maxBytes: 10000000
    }, async function whenDone (err, uploadedFiles) {
      if (!uploadedFiles.length) {
        return res.status(201).json({
          result: 0,
          message: 'Internal server error!',
          error: err
        });
      } else {
        const result = await cloudinary.uploader.upload(uploadedFiles[0].fd);
        req.body.image = result.url;
        req.body.cloudId = result.public_id,
        addData(req, res);
      }
    });
  } else {
    addData(req, res);
  }
};

exports.editNewsFeed = async (req, res) => {
  NewsFeed.findOneById(req.body.id).exec( async (err, newsFeed) =>{
    if (err) {
      res.json(200, {
        result: 0,
        message: 'Error occurs',
        error: err
      });
    } else {
      try {
        setTimeout(async () => {
          if (req.body.editFile == 'true') {
            await cloudinary.uploader.destroy(newsFeed.cloudId, function (error, result) {  });
            // upload new image to cloudinary
            req.file('image').upload({
              maxBytes: 10000000
            }, async function whenDone (err, uploadedFiles) {
              if (!uploadedFiles.length) {
                return res.status(201).json({
                  result: 0,
                  message: 'Internal server error!',
                  error: err
                });
              } else {
                const result = await cloudinary.uploader.upload(uploadedFiles[0].fd);
                req.body.image = result.url;
                req.body.cloudId = result.public_id,
                editData(req.body, res);
              }
            });
          } else {
            editData(req.body, res);
          }
        },1000);
      } catch (err) {
        return res.status(201).json({
          result: 0,
          message: 'Internal server error!',
          error: err
        });
      }
    }
  });
};

function editData (body, res) {
  const id = body.id;
  delete body.id;
  delete body.editFile;
  NewsFeed.update(id, body)
    .exec(function (err, news) {
      if (err) {

        res.json(200, {
          result: 0,
          message: 'Error occurs',
          error: err
        });
      } else {
        return res.json(200, {
          result: 1,
          data: news
        });
      }
    });
}

function addData (req, res) {
  NewsFeed.create(req.body)
    .exec(function (err, news) {
      if (err) {
        res.json(200, {
          result: 0,
          message: 'Error occurs',
          error: err
        });
      } else {
        return res.json(200, {
          result: 1,
          data: news
        });
      }
    });
}

exports.getNewsFees = async (req, res) => {
  const limit = req.body.limit,
    skip = req.body.skip;
  let response = [];
  const ObjectId = objectIdService.ObjectId;

  NewsFeed.find()
    .skip(skip)
    .limit(limit)
    .sort('id DESC')
    .exec(function (err, news) {
      if (err) {
        res.json(200, {
          result: 0,
          message: 'Error occurs',
          error: err
        });
      } else {
        return res.json(200, {
          result: 1,
          data: news
        });
      }
    });
};

exports.getRating = async (req, res) => {
  Order.find()
    .where({
      providerId: req.params.providerId, status: 'Completed'
    })
    .exec((err, orders) => {
      if (err) {
        res.json(200, {
          result: 0,
          message: 'Error occurs',
          error: err
        });
      } else {
        const sum = _.sumBy(orders, function (o) { return o.totalAmount; });
        const ratingSum = _.sumBy(orders, function (o) { return o.rating; });

        const orderCount = orders.length;
        User.findOneById(req.params.providerId)
          .exec((err, user) => {
            if (err) {
              res.json(200, {
                result: 0,
                message: 'Error occurs',
                error: err
              });
            } else {
              return res.json(200, {
                result: 1,
                data: {
                  noOfOrder: orderCount,
                  totalRevenue: (sum / orderCount),
                  regDays: user.createdAt,
                  rating: (ratingSum / orderCount) || 0
                }
              });
            }
          });
      }
    });
};

exports.deleteNewsFeed = async (req, res) => {
  NewsFeed.findOneById(req.params.id).exec((err, newsFeed) => {
    if (err) {
      res.json(200, {
        result: 0,
        message: 'Error occurs',
        error: err
      });
    } else {
      if (newsFeed) {
        NewsFeed.destroy(req.params.id).exec(function (err, news) {
          if (err) {
            res.json(200, {
              result: 0,
              message: 'Error occurs',
              error: err
            });
          } else {
            // deleted image as well from cloudinary
            cloudinary.uploader.destroy(newsFeed.cloudId, function (error, result) { console.log(result, 'error---', error); });

            return res.json(200, {
              result: 1
            });
          }
        });
      };

    }
  });

};
exports.getNewsFeedById = async (req, res) => {
  NewsFeed.findOneById(req.params.id).exec((err, newsFeed) => {
    if (err) {
      res.json(200, {
        result: 0,
        message: 'Error occurs',
        error: err
      });
    } else {
      return res.json(200, {
        result: 1,
        data: newsFeed
      });
    }
  });
};
