
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dqlqezsuz',
  api_key: '876992497762529',
  api_secret: 'SWWMN6ZvofwVdn9evtehTb7Gw0g'
});
// var ObjectId = require('mongodb').ObjectID;

exports.createDumyOrder = async (req, res) => {
  const body = req.body;
  let response;
  try {

    if (req.user.id !== req.body.seekerId) {
      return res.status(201).json({
        result: 0,
        message: 'Not Authenticate.'
      });
    }

    const order = await Order.findOne({
      productNeedId: req.body.productNeedId,
      quatationId: body.quatationId
    });

    if (order && order.status === 'Pending') {
      return res.status(201).json({
        result: 1,
        data: order
      });
    }
    const need = await ProductNeed.findOneById(body.productNeedId);
    if (!need) {
      return res.status(201).json({
        result: 0,
        message: 'need id not valid.'
      });
    }
    const quatation = await Quatations.findOneById(body.quatationId);
    if (!quatation) {
      return res.status(201).json({
        result: 0,
        message: 'quatation id not valid.'
      });
    }

    body.paymentStatus = {
      'firstPayment': {
        'amountPercentage': quatation.firstPayment,
        'status': '0'
      },
      'milestone1': {
        'amountPercentage': (quatation.milestone1) ? quatation.milestone1 : 0,
        'status': '0'
      },
      'milestone2': {
        'amountPercentage': (quatation.milestone2) ? quatation.milestone2 : 0,
        'status': '0'
      },
      'milestone3': {
        'amountPercentage': (quatation.milestone3) ? quatation.milestone3 : 0,
        'status': '0'
      },
      'lastPayment': {
        'amountPercentage': quatation.lastPayment,
        'status': '0'
      }
    };
    let milestoneCount = 2;
    for (i = 1; i < 3; i++) {
      (body.paymentStatus['milestone' + i]['amountPercentage']) ? milestoneCount++ : '';
    }
    body.dueMilestone = 'firstPayment';
    body.paidAmount = 0;
    body.totalAmount = quatation.totalAmount;
    body.completionDate = quatation.estimatedDeliveryDate;
    body.numOfMilestore = milestoneCount;
    response = await Order.create(body);
  }
  catch (e) {
    return res.status(201).json({
      result: 0,
      error: e,
      message: 'Error occurs'
    });
  }
  res.status(200).json({
    result: 1,
    data: response
  });
};

exports.removeDumyOrder = async (req, res) => {
  const body = req.body;
  let response;
  try {
    response = await Order.destroy(req.params.id);
  }
  catch (e) {
    return res.status(201).json({
      result: 0,
      error: e,
      message: 'Error occurs'
    });
  }
  res.status(200).json({
    result: 1,
    data: response
  });
};

exports.saveOrder = async (req, res) => {

  const body = req.body;
  let response;
  try {

    const order = await Order.findOne({
      id: req.body.orderId,
      status: 'Pending'
    });

    if (!order) {
      return res.status(201).json({
        result: 0,
        message: 'Invaild order'
      });
    }

    if (req.user.id !== order.seekerId) {
      return res.status(201).json({
        result: 0,
        message: 'Not Authenticate.'
      });
    }

    const transactionDetail = req.body.transactionDetail;

    const transaction = await Transaction.create({
      orderId: req.body.orderId,
      detail: transactionDetail
    });

    const quatation = await Quatations.findOneById(order.quatationId);

    if (!quatation) {
      return res.status(201).json({
        result: 0,
        message: 'quatation id not valid.'
      });
    }

    if (transactionDetail.response.state == 'approved') {

      quatation.isAccepted = true;
      await Quatations.update(quatation.id, quatation);
      await ProductNeed.update(quatation.parentNeedId, {
        isQuatationAccepted: true, orderPlaceFor: quatation.creator
      });

      let payedMilestone, dueMilestone;
      let paymentObj = order.paymentStatus;
      for (let key in paymentObj) {
        if (!payedMilestone && paymentObj[key]['status'] == '0') {
          payedMilestone = key;
          paymentObj[key]['status'] = '1';
        } else if (payedMilestone && !dueMilestone) {
          dueMilestone = (order.paymentStatus[key]['amountPercentage'] != 0) ? key : '';
        }
      }

      await Order.update(req.body.orderId, {
        status: 'On Going',
        dueMilestone: dueMilestone,
        lastPaymentDate: new Date(),
        paymentStatus: JSON.stringify(paymentObj),
        paidAmount: req.body.paidAmount + order.totalAmount

      });

    } else {

      return res.status(201).json({
        result: 0,
        message: 'Order not confirm'
      });
    }

  }
  catch (e) {
    console.log(e);

    return res.status(201).json({
      result: 0,
      error: e,
      message: 'Error occurs'
    });
  }
  res.status(200).json({
    result: 1,
    data: response,
    message: 'Order Placed Successfully.'
  });
};

exports.getOwnOrdersByUserId = async (req, res) => {
  const params = req.params;
  const isProvider = (params.type == 'provider');
  const isSeeker = (params.type == 'seeker');
  let response;
  const ObjectId = objectIdService.ObjectId;
  const limit = req.body.limit,
    skip = req.body.skip;
  try {
    if (!isProvider && !isSeeker) {
      return res.status(404); // wrong url.
    }

    const user = await User.findOneById(params.id);

    if (!user) {
      return res.status(201).json({
        result: 0,
        message: 'Invailid User'
      });
    }

    if (!(user.isProvider && isProvider) && !(!user.isProvider && isSeeker)) {
      return res.status(201).json({
        result: 0,
        message: 'Invailid Id.'
      });
    }

    let query = {
    };

    if (user.isProvider) {
      query = Object.assign({
        providerId: new ObjectId(user.id),
        status: {
          $ne: 'Pending'
        }
      });
    } else {
      query = Object.assign({
        seekerId: new ObjectId(user.id),
        status: {
          $ne: 'Pending'
        }
      });
    }

    Order.native((error, collection) => {
      collection.aggregate([
        {
          $match: query
        },
        {
          $lookup: {
            from: 'profile',
            localField: 'providerId',
            foreignField: 'userId',
            as: 'provider'
          }
        },
        {
          $lookup: {
            from: 'profile',
            localField: 'seekerId',
            foreignField: 'userId',
            as: 'seeker'
          }
        },
        {
          $lookup: {
            from: 'productneed',
            localField: 'productNeedId',
            foreignField: '_id',
            as: 'need'
          }
        },
        {
          $project: {
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            completionDate: 1,
            milestoneCount: 1,
            provider: {
              phoneNumber: 1,
              _id: 1,
              avatarUrl: 1,
              name: 1,
              nick_name: 1,
              email: 1
            },
            seeker: {
              phoneNumber: 1,
              _id: 1,
              avatarUrl: 1,
              name: 1,
              nick_name: 1,
              email: 1
            },
            need: {
              title: 1,
              _id: 1,
              information: 1,
              paymentStatus: 1,
              status: 1,
              totalAmount: 1,
              updatedAt: 1,
              createdAt: 1
            }
          }
        },
        {
          $skip: Number(skip)
        },
        {
          $limit: Number(limit)
        }
      ]).toArray((err, data) => {
        res.status(200).json({
          result: 1,
          data
        });
      });
    });
  }
  catch (e) {
    return res.status(201).json({
      result: 0,
      error: e,
      message: 'Error occurs'
    });
  }
};

exports.getAllOrders = async (req, res) => {
  let response;
  try {
    if (!req.user.type !== 'admin') {
      return res.status(201).json({
        result: 0,
        message: 'Invailid User'
      });
    }

    Order.native((error, collection) => {
      collection.aggregate([
        {
          $lookup: {
            from: 'profile',
            localField: 'providerId',
            foreignField: 'userId',
            as: 'provider'
          }
        },
        {
          $lookup: {
            from: 'profile',
            localField: 'seekerId',
            foreignField: 'userId',
            as: 'seeker'
          }
        },
        {
          $lookup: {
            from: 'productneed',
            localField: 'productNeedId',
            foreignField: '_id',
            as: 'need'
          }
        },
        {
          $project: {
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            provider: {
              phoneNumber: 1,
              _id: 1,
              avatarUrl: 1,
              name: 1,
              email: 1
            },
            seeker: {
              phoneNumber: 1,
              _id: 1,
              avatarUrl: 1,
              name: 1,
              email: 1
            },
            need: {
              title: 1,
              _id: 1,
              information: 1,
              totalAmount: 1,
              updatedAt: 1,
              createdAt: 1
            }
          }
        }
      ]).toArray((err, data) => {
        res.status(200).json({
          result: 1,
          data
        });
      });
    });
  }
  catch (e) {
    return res.status(201).json({
      result: 0,
      error: e,
      message: 'Error occurs'
    });
  }
};

exports.uploadOrderImages = async (req, res) => {
  try {
    const uploader = new AvatarUploader();
    Order.findOne({
      id: req.params.id
    }, (err, order) => {

      if (order) {
        req.file('orderImages').upload({
          // don't allow the total upload size to exceed ~10MB
          maxBytes: 10000000
        }, async function whenDone (err, uploadedFiles) {
          if (err) {
            return res.status(201).json({
              result: 0,
              message: 'Error Occurs.',
              error: err
            });
          }

          // If no files were uploaded, respond with an error.
          if (uploadedFiles.length === 0) {
            return res.status(201).json({
              result: 0,
              message: 'No file was uploaded'
            });
          }
          await uploadedFiles.forEach((file) => {
            cloudinary.uploader.upload(file.fd, async (result) => {
              const files = order.OrderImages;
              files.push({
                id: result.public_id,
                url: result.url
              });
              await Order.update(order.id, {
                OrderImages: files
              })
                .exec((error, response) => {
                  if (error) {
                    return res.status(201).json({
                      result: 0,
                      message: 'Error Occurs.',
                      error: error
                    });
                  } else {
                    return res.status(201).send({
                      result: 1,
                      message: 'Successfully Uploaded'
                    });
                  }
                });
            });
          });
        });
      } else if (err) {
        return res.json({
          result: 0,
          error: err,
          message: 'Error Occurs, Please try again later'
        });
      } else {
        return res.status(200).json({
          result: 0,
          message: 'Order not available'
        });
      }
    });
  } catch (e) {
    return res.status(201).json({
      result: 0,
      message: 'Internal server error!',
      error: e
    });
  }
};

exports.getOrder = async (req, res) => {
  try {

    if (!req.params.id) {
      return res.status(201).json({
        result: 0,
        message: 'orderId requried.'
      });
    }

    Order.findById(req.params.id).populateAll().exec(async (err, order) => {
      if (err) {
        res.json({
          result: 0,
          error: err,
          message: 'Error Occurs'
        });
      } else {
        if (order) {
          return res.status(200).json({
            result: 1,
            data: order
          });
        } else {
          return res.status(201).json({
            result: 0,
            message: 'no result found'
          });
        }
      }

    });
  } catch (e) {
    return res.status(201).json({
      result: 0,
      error: e,
      message: 'Error occurs'
    });
  }
};

exports.removeOrderImages = async (req, res) => {
  const imagesId = req.body.orderImages;
  try {
    if (!imagesId || !imagesId.length) {
      res.status(201).json({
        result: 0,
        message: 'Image Ids required.'
      });
    }
    const uploader = new AvatarUploader();
    Order.findOne({
      id: req.params.id
    }, async (err, order) => {
      if (order) {
        let images = order.OrderImages;
        let orderImages = [];
        async.forEach(imagesId, async (image, callback) => {
          try {
            await cloudinary.uploader.destroy(image);
            let indexOf = await images.findIndex((val, index) => {
              return val.id === image;
            });

            if (indexOf !== -1) {
              images.splice(indexOf, 1);
            }
            callback();
          }
          catch (e) {
            callback(e);
          }
        }, (error, response) => {
          if (!error) {
            Order.update({
              id: req.params.id
            }, {
              OrderImages: images
            }, (e, responce) => {
              res.status(200).send({
                result: 1,
                message: 'Successfully deleted'
              });
            });
          } else {
            res.status(201).json({
              result: 0,
              error: err,
              message: 'Error Occurs, Please try again later'
            });
          }
        });
      } else if (err) {
        return res.json({
          result: 0,
          error: err,
          message: 'Error Occurs, Please try again later'
        });
      } else {
        return res.status(200).json({
          result: 0,
          message: 'User not available'
        });
      }
    });
  } catch (e) {
    return res.status(201).json({
      result: 0,
      message: 'Internal server error!',
      error: e
    });
  }
};

exports.duePaymentsOrder = async (req, res) => {
  const body = req.body;
  let response;
  try {

    const order = await Order.findOne({
      id: req.body.orderId,
      status: 'On Going'
    });

    if (!order) {
      return res.status(201).json({
        result: 0,
        message: 'Invaild order'
      });
    }

    if (req.user.id !== order.seekerId) {
      return res.status(201).json({
        result: 0,
        message: 'Not Authenticate.'
      });
    }

    const transactionDetail = req.body.transactionDetail;

    const transaction = await Transaction.create({
      orderId: req.body.orderId,
      detail: transactionDetail
    });
    if (transactionDetail.response.state === 'approved') {
      let payedMilestone, dueMilestone;
      let paymentObj = order.paymentStatus;
      payedMilestone = order.dueMilestone;
      for (let key in paymentObj) {
        if (key == payedMilestone) {
          paymentObj[payedMilestone]['status'] = '1';
        } else if (!dueMilestone && key != payedMilestone) {
          dueMilestone = (order.paymentStatus[key]['amountPercentage'] != 0 && order.paymentStatus[key]['status'] != 1) ? key : '';
        }
      }

      let orderStatus = (payedMilestone != 'lastPayment') ? 'On Going' : 'Completed';
      let rating = (body.rating) ? body.rating : 0;
      response = await Order.update(req.body.orderId, {
        status: orderStatus,
        dueMilestone: dueMilestone,
        rating: rating,
        paymentStatus: JSON.stringify(paymentObj),
        paidAmount: req.body.paidAmount + order.totalAmount,
        lastPaymentDate: new Date()

      });
    } else {
      return res.status(201).json({
        result: 0,
        error: e,
        message: 'Order not confirm'
      });
    }
  }
  catch (e) {
    return res.status(201).json({
      result: 0,
      error: e,
      message: 'Error occurs'
    });
  }
  res.status(200).json({
    result: 1,
    data: response,
    message: 'Order Placed Successfully.'
  });
};

