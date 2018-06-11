'use strict';

// var ObjectId = require('mongodb').ObjectID;

exports.addNeedsComment = async (req, res) => {
  const body = req.body;
  const currentUser = req.session.user;
  let response;
  try {
    if (currentUser.id !== body.userId) {
      return res.status(201).json({
        result: 0,
        message: 'Authentication Error'
      });
    };

    if (!currentUser.isProvider) {
      return res.status(201).json({
        result: 0,
        message: 'Seeker not have the privileges to add the comments on the need'
      });
    }

    delete body.userId;
    body.createdBy = currentUser.id;
    response = await ProductNeedComment.create(body);
  }
  catch (e) {
    res.status(201).send({
      result: 0,
      error: e,
      message: 'Error Ocurs'
    });
  }
  res.status(200).send({
    result: 1,
    message: 'Successfully Added',
    data: response
  });
};

exports.getProvidersListWithNeedsCommentsCounts = async (req, res) => {
  const productNeedId = req.params.needId;
  let response;
  const ObjectId = objectIdService.ObjectId;
  try {
    const need = await ProductNeed.findOneById(productNeedId);
    if (!need) {
      return res.status(201).json({
        result: 0,
        message: 'Invaild Product Need Id'
      });
    }
    ProductNeedComment.native(async (err, collection) => {
      try {
        if (err) {
          console.log('...', err);
        }
        else {
          collection.aggregate([
            {
              $match: {
                'productNeedId': new ObjectId(need.id)
              }
            },
            {
              $sort: {
                'createdAt': -1
              }
            }, {
              $group: {
                _id: {
                  createdBy: '$createdBy',
                  productNeedId: '$productNeedId'
                },
                previousComment: {
                  $first: '$title'
                },
                createdAt: {
                  $first: '$createdAt'
                },
                commentsCount: {
                  $sum: 1
                }
              }
            }, {
              $lookup: {
                from: 'profile',
                localField: '_id.createdBy',
                foreignField: 'userId',
                as: 'provider'
              }
            },
            {
              $project: {
                _id: 1,
                previousComment: 1,
                commentsCount: 1,
                createdAt: 1,
                productNeedId: 1,
                provider: {
                  name: 1,
                  avatarUrl: 1,
                  userId: 1
                }
              }
            }
          ])
            .toArray((err, allProducts) => {
              if (err) {
                res.status(200).send({
                  result: 0,
                  error: err,
                  message: 'Error Occurs'
                });
              } else {
                res.status(200).send({
                  result: 1,
                  data: allProducts
                });
              }
            });
        }

      }
      catch (e) {
        res.status(200).send({
          result: 0,
          error: e,
          message: 'Error Occurs'
        });
      }
    });
  }
  catch (e) {
    res.status(201).send({
      result: 0,
      error: e,
      message: 'Error Ocurs'
    });
  }
};

exports.getNeedsCommentByNeedAndProviderId = async (req, res) => {
  const productNeedId = req.params.needId;
  const createdBy = req.params.providerId;
  let response;
  try {
    const need = await ProductNeed.findOne({
      id: productNeedId
    });
    if (!need) {
      return res.status(201).json({
        result: 0,
        message: 'Invaild Product Need Id'
      });
    }
    response = await ProductNeedComment.find({
      productNeedId: productNeedId,
      createdBy
    }, {
      select: [
        'title',
        'createdAt',
        'createdBy',
        'id'
      ]
    });
  }
  catch (e) {
    res.status(201).send({
      result: 0,
      error: e,
      message: 'Error Ocurs'
    });
  }
  res.status(200).json({
    result: 1,
    data: response
  });
};

exports.editNeedsComment = (req, res) => {
  res.status(200).send();
};
