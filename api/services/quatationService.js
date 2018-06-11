exports.addQuatation = async (req, res) => {
  const needId = req.body.needId;
  const creatorId = req.body.creator;

  try {

    if (!needId) {
      return res.status(201).json({
        result: 0,
        message: 'Need Id required.'
      });
    }

    if (!creatorId) {
      return res.status(201).json({
        result: 0,
        message: 'creator required.'
      });
    }

    if (creatorId !== req.session.user.id) {
      return res.status(201).json({
        result: 0,
        message: 'Not Authenticated.'
      });
    }

    const user = await User.findOneById(creatorId);

    if (!user || !user.isProvider) {
      return res.status(201).json({
        result: 0,
        message: 'Invailid creator.'
      });
    }

    const need = await ProductNeed.findOneById(needId);

    if (!need) {
      return res.status(201).json({
        result: 0,
        message: 'Invailid Need Id.'
      });
    }
    let parentNeedId = need.superParentNeed;

    if (need.superParentNeed == null) {
      parentNeedId = needId;
    }

    const needQatation = await Quatations.findOne({
      'needId': needId,
      'creator': creatorId
    });

    if (needQatation) {
      return res.status(201).json({
        result: 0,
        message: 'Already quatations is submitted by you.'
      });
    }

    body = req.body;

    let totalAmount = 0;

    if (body.firstPayment) {
      totalAmount += Number(body.firstPayment);
    }
    if (body.milestone1) {
      totalAmount += Number(body.milestone1);
    }
    if (body.milestone2) {
      totalAmount += Number(body.milestone2);
    }
    if (body.milestone3) {
      totalAmount += Number(body.milestone3);
    }
    if (body.lastPayment) {
      totalAmount += Number(body.lastPayment);
    }

    if (totalAmount !== 100) {
      return res.status(201).json({
        result: 0,
        message: 'Payment is not 100%'
      });
    }

    let deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + parseInt(body.estimatedDay));

    let quatationData = {
      needId: needId,
      parentNeedId: parentNeedId,
      creator: creatorId,
      firstPayment: body.firstPayment,
      milestone1: body.milestone1,
      milestone2: body.milestone2,
      milestone3: body.milestone3,
      lastPayment: body.lastPayment,
      comment: body.comment,
      estimatedDay: body.estimatedDay,
      estimatedDeliveryDate: deliveryDate,
      totalAmount: body.totalAmount
    };

    const quatation = await Quatations.create(quatationData);

    if (need.superParentNeed != null) {
      await ProductNeed.update(need.id, {
        isQuatation: true,
        totalAmount: body.totalAmount
      });
    }

    let needVendor = {
      need: needId,
      question: quatation.id,
      provider: creatorId
    };

    await NeedVendor.create(needVendor);

    res.status(200).json({
      result: 1,
      quatation
    });

  } catch (err) {
    res.status(201).json({
      result: 0,
      error: err,
      message: 'Error Occurs'
    });
  }

};
exports.getQuatation = async (req, res) => {
  Quatations.findById(req.params.id).populateAll().exec(async (err, quatation) => {
    if (err) {
      res.json({
        result: 0,
        error: err,
        message: 'Error Occurs'
      });
    } else {
      if (quatation) {
        quatation[0].needId.category = await Category.findOneById(quatation[0].needId.category);
        quatation[0].needId.subcategories = await Category.find().where({
          id: quatation[0].needId.subcategories
        });
        quatation[0].provider = await Profile.findOne({
          select: ['name', 'nick_name'], userId: quatation[0].creator.id
        });

        return res.status(200).json({
          result: 1,
          data: quatation[0]
        });
      } else {
        return res.status(201).json({
          result: 0,
          message: 'no result found'
        });
      }
    }
  });
};

exports.getQuatationsByNeedId = async (req, res) => {
  Quatations.find({
    'parentNeedId': req.params.needId
  }).exec((err, quatation) => {
    if (err) {
      res.json({
        result: 0,
        error: err,
        message: 'Error Occurs'
      });
    } else {
      res.json(200, {
        result: 1,
        data: quatation
      });
    }
  });
};

exports.editQuatation = async (req, res) => {
  const needId = req.body.needId;
  const quatationId = req.params.id;
  const creatorId = req.body.creator;

  try {
    if (!needId) {
      return res.status(201).json({
        result: 0,
        message: 'Need Id required.'
      });
    }

    if (!creatorId) {
      return res.status(201).json({
        result: 0,
        message: 'creator required.'
      });
    }

    if (creatorId != req.session.user.id) {
      return res.status(201).json({
        result: 0,
        message: 'Not Authenticated.'
      });
    }

    const user = await User.findOneById(creatorId);

    if (!user || !user.isProvider) {
      return res.status(201).json({
        result: 0,
        message: 'Invailid creator.'
      });
    }

    const need = await ProductNeed.findOneById(needId);

    if (!need) {
      return res.status(201).json({
        result: 0,
        message: 'Invailid Need Id.'
      });
    }

    let quatation = await Quatations.findOneById(quatationId);

    if (!quatation) {
      return res.status(201).json({
        result: 0,
        message: 'Invailid Qatation Id.'
      });
    }
    if (!quatation.isNeedModified && quatation.isActive) {
      Quatations.update(quatation.id, req.body)
        .exec((err, updatedQuatation) => {
          if (err) {
            res.status(201).json({
              result: 0,
              message: 'server error',
              error: err
            });
          } else {
            res.status(200).json({
              result: 1,
              data: updatedQuatation
            });
          }
        });
    }
    req.body.creator = req.session.user.id;
    body = req.body;
    let totalAmount = 0;
    if (body.firstPayment) {
      totalAmount += Number(body.firstPayment);
    }
    if (body.milestone1) {
      totalAmount += Number(body.milestone1);
    }
    if (body.milestone2) {
      totalAmount += Number(body.milestone2);
    }
    if (body.milestone3) {
      totalAmount += Number(body.milestone3);
    }
    if (body.lastPayment) {
      totalAmount += Number(body.lastPayment);
    }

    if (totalAmount !== 100) {
      return res.status(201).json({
        result: 0,
        message: 'Payment is not 100%'
      });
    }

    let superParentNeed = (need.superParentNeed == null) ? needId : need.superParentNeed;
    let quatationData = {
      needId: needId,
      parentNeedId: superParentNeed,
      quatationId: quatationId,
      creator: creatorId,
      firstPayment: body.firstPayment,
      milestone1: body.milestone1,
      milestone2: body.milestone2,
      milestone3: body.milestone3,
      lastPayment: body.lastPayment,
      comment: body.comment,
      totalAmount: totalAmount
    };

    quatation = await Quatations.create(quatationData);

    if (need.superParentNeed != null) {
      await ProductNeed.update(need.id, {
        isQuatation: true,
        totalAmount: body.totalAmount,
        providerId: creatorId
      });
    }

    let needVendor = {
      need: needId,
      question: quatation.id,
      provider: creatorId
    };

    await NeedVendor.create(needVendor);

    res.status(200).json({
      result: 1,
      quatation
    });

  } catch (err) {
    console.log(err);
    res.status(201).json({
      result: 0,
      error: err
    });
  }

};

exports.providerListByNeedId = async (req, res) => {
  const ObjectId = objectIdService.ObjectId;

  const needId = req.params.needId;
  const limit = req.body.limit,
    skip = req.body.skip;
  Quatations.native((error, collection) => {
    collection.aggregate([
      {
        $match: {
          parentNeedId: new ObjectId(needId)
        }
      },
      {
        $group: {
          _id: {
            creator: '$creator'
          },
          count: {
            '$sum': 1
          },
          previousComment: {
            $first: '$comment'
          },
          previousCommentDate: {
            $first: '$createdAt'
          }
        }
      },
      {
        $lookup: {
          from: 'profile',
          localField: '_id.creator',
          foreignField: 'userId',
          as: 'provider'
        }
      },
      {
        $skip: Number(skip)
      },
      {
        $limit: Number(limit)
      }
      // {
      //   $project: {
      //     title:1,
      //   }
      // }
    ]).toArray((err, data) => {
      res.status(200).json({
        result: 1,
        data: data
      });
    });
  });
};

