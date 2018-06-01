const _ = require('lodash');
// var ObjectId = require('mongodb').ObjectID;

exports.addNeeds = async (req, res) => {
  const creator = req.body.creator;
  try {

    const user = await User.findOneById(creator);
    const body = req.body;
    if (!user || req.session.user.id !== user.id) {
      return res.status(201).json({
        result: 0,
        message: 'Invailid creator'
      });
    }

    if (user.isProvider) {
      return res.status(201).json({
        result: 0,
        message: 'User not have the rights to create need.'
      });
    };
    const category = await Category.findOneById(body.category);
    const subCategories = await Category.find({
      id: body.subcategories
    });

    if (!category) {
      return res.status(201).json({
        result: 0,
        message: 'Invailid catergory'
      });
    }

    if (!subCategories || !subCategories.length) {
      return res.status(201).json({
        result: 0,
        message: 'Invailid subcategory'
      });
    }
    const userCategories = await user.myCategories();
    const userSubCategories = await user.mySubCategories();
    const isUserCategory = (userCategories.indexOf(category.id) !== -1);
    if (!isUserCategory) {
      return res.status(201).json({
        result: 0,
        message: 'Invailid category'
      });
    }

    const isUserSubCategories = await __isSubset(userSubCategories, body.subCategories);

    if (isUserSubCategories) {
      return res.status(201).json({
        result: 0,
        message: 'All categories not subscribe by user.'
      });
    }

    req.body.creator = req.session.user.id;
    let totalPerc = 0;
    if (body.firstPayment) {
      totalPerc += Number(body.firstPayment);
    }
    if (body.milestone1) {
      totalPerc += Number(body.milestone1);
    }
    if (body.milestone2) {
      totalPerc += Number(body.milestone2);
    }
    if (body.milestone3) {
      totalPerc += Number(body.milestone3);
    }
    if (body.lastPayment) {
      totalPerc += Number(body.lastPayment);
    }

    if (totalPerc !== 100) {
      return res.status(201).json({
        result: 0,
        message: 'Payment is not 100%'
      });
    }

    const need = await ProductNeed.create(req.body);

    res.status(200).json({
      result: 1,
      need
    });
  } catch (err) {
    console.log(err);
    res.status(201).json({
      result: 0,
      error: err
    });
  }

};
//skeeker
exports.getNeeds = (req, res) => {
  try {
    // const currentUser = req.session.user;
    const limit = Number(req.body.limit),
      skip = Number(req.body.skip),
      currentUser = req.body.userId;
    UsersCategories.find()
      .where({
        user_id: currentUser
      })
      .exec((err, userCategories) => {
        if (err) {
          res.json(201, {
            result: 0,
            message: 'server error',
            error: err
          });
        } else {
          const categories = [];
          async.each(userCategories, (category, callback) => {
            async.each(category.categories, (childcategory, callbackInner) => {
              categories.push(childcategory.category_id);
              callbackInner();
            }, (err) => {
              callback();
            });
          }, (err) => {
            ProductNeed.find()
              .where({
                category: categories,
                superParentNeed: null
              })
              .skip(skip)
              .limit(limit)
              .populateAll().sort('createdAt DESC')
              .exec((err, needs) => {
                if (err) {
                  res.json(201, {
                    result: 0,
                    message: 'server error',
                    error: err
                  });
                } else {
                  let allNeeds = [];
                  async.each(needs, (need, callback) => {
                    NeedVendor.find({
                      need: need.id
                    })
                      .exec((err, venNeeds) => {
                        need.venderNeeds = venNeeds;
                        allNeeds.push(need);
                        callback();
                      });
                  }, (err) => {
                    allNeeds = allNeeds.sort(function (a, b) { return (new Date(a.createdAt)) < (new Date(b.createdAt)) ? 1 : -1; });
                    res.json(200, {
                      result: 1,
                      data: allNeeds
                    });
                  });
                }
              });
          });
        }
      });
  } catch (err) {
    res.json(201, {
      result: 0,
      message: 'server error',
      error: err
    });
  }
};

exports.getNeedById = (req, res) => {
  try {
    const currentUser = req.session.user;
    ProductNeed.findOneById(req.params.id)
      .populateAll()
      .exec(async (err, need) => {
        if (err) {
          res.json(201, {
            result: 0,
            message: 'server error',
            error: err
          });
        } else {
          const subCategories = await Category.find({
            where: {
              id: need.subcategories[0]
            }
          });

          const order = await Order.find({
            where: {
              productNeedId: need.id
            }
          });

          need.orderPlaced = false;

          if (order) {
            need.orderPlaced = true;
          }

          need.subcategories = subCategories;

          res.json(200, {
            result: 1,
            data: need
          });
        }
      });
  } catch (err) {
    res.json(201, {
      result: 0,
      message: 'server error',
      error: err
    });
  }
};

exports.editNeed = async (req, res) => {

  try {
    const currentUser = req.session.user;
    ProductNeed.findOneById(req.params.id)
      .where({
        creator: (currentUser && currentUser.id)
      })
      .exec(async (err, productNeed) => {
        console.log('productNeed', productNeed);
        if (err) {
          res.json(201, {
            result: 0,
            message: 'server error',
            error: err
          });
        } else if (productNeed && productNeed.id) {

          NeedVendor.find({
            need: productNeed.id
          })
            .exec(async (err, venNeeds) => {
              if (err) {
                res.json(201, {
                  result: 0,
                  message: 'server error',
                  error: err
                });
              } else {
                console.log('venNeeds::', venNeeds);

                if (!venNeeds || venNeeds.length == 0) {
                  //modify need
                  ProductNeed.update(productNeed.id, req.body)
                    .exec(async (err, updatedNeed) => {
                      if (err) {
                        res.json(201, {
                          result: 0,
                          message: 'server error 1',
                          error: err
                        });
                      } else {
                        res.json(200, {
                          result: 1,
                          data: updatedNeed
                        });
                      }
                    });
                } else {

                  //create copy for need
                  req.body.creator = req.session.user.id;
                  let totalPerc = 0;
                  let need = req.body;
                  if (need.firstPayment) {
                    totalPerc += Number(need.firstPayment);
                  }
                  if (need.milestone1) {
                    totalPerc += Number(need.milestone1);
                  }
                  if (need.milestone2) {
                    totalPerc += Number(need.milestone2);
                  }
                  if (need.milestone3) {
                    totalPerc += Number(need.milestone3);
                  }
                  if (need.lastPayment) {
                    totalPerc += Number(need.lastPayment);
                  }

                  if (totalPerc !== 100) {
                    return res.status(201).json({
                      result: 0,
                      message: 'Payment is not 100%'
                    });
                  }
                  let quatationId = req.body.quatationId;
                  const quatation = await Quatations.findOneById(quatationId);
                  console.log('quatation::', quatation);
                  productNeed.superParentNeed = (productNeed.superParentNeed == null) ? req.params.id : productNeed.superParentNeed;
                  productNeed.id = '';
                  productNeed.information = req.body.information;
                  productNeed.parentNeed = req.params.id;
                  productNeed.quatationId = req.body.quatationId;
                  productNeed.firstPayment = req.body.firstPayment;
                  productNeed.milestone1 = req.body.milestone1;
                  productNeed.milestone2 = req.body.milestone2;
                  productNeed.milestone3 = req.body.milestone3;
                  productNeed.lastPayment = req.body.lastPayment;
                  productNeed.quatationCreator = quatation.creator;
                  productNeed.providerId = quatation.creator;
                  productNeed.isQuatation = false;
                  delete (productNeed['createdAt']);
                  delete (productNeed['updatedAt']);
                  console.log('productNeed::', productNeed);
                  ProductNeed.create(productNeed)
                    .exec(async (err, need) => {
                      if (err) {
                        console.log('err', err);
                        res.status(201).json({
                          result: 0,
                          error: err
                        });
                      } else {
                        let quatationId = req.body.quatationId;

                        await Quatations.update(quatationId, {
                          isNeedModified: true,
                          isActive: false
                        });
                        //console.log("qutation ;: ",qutation);
                        res.status(200).json({
                          result: 1,
                          need
                        });
                      }
                    });
                }
              }
            });
        } else {
          console.log('we are here');
          res.json(201, {
            result: 0,
            need: {

            }
          });
        }
      });
  } catch (err) {
    res.json(201, {
      result: 0,
      message: 'server error3',
      error: err
    });
  }
};

exports.getOwnNeeds = (req, res) => {
  try {
    const limit = Number(req.body.limit),
      skip = Number(req.body.skip);
    // const currentUser = req.session.user;
    const currentUser = req.body.userId;
    ProductNeed.find()
      .where({
        creator: currentUser,
        superParentNeed: null
      })
      .skip(skip)
      .limit(limit)
      .populateAll()
      .sort({
        createdAt: -1
      })
      .exec((err, needs) => {
        if (err) {
          res.json(201, {
            result: 0,
            message: 'server error',
            error: err
          });
        } else {
          // res.json(200, {
          //   result: 1,
          //   data: needs
          // });
          let allNeeds = [];
          async.each(needs, (need, callback) => {
            NeedVendor.find({
              where: {
                need: need.id
              }
            })
              .exec((err, venNeeds) => {
                need.venderNeeds = venNeeds;
                allNeeds.push(need);
                callback();
              });
          }, (err) => {
            allNeeds = allNeeds.sort(function (a, b) { return (new Date(a.createdAt)) < (new Date(b.createdAt)) ? 1 : -1; });
            res.json(200, {
              result: 1,
              data: allNeeds
            });
          });
        }
      });
  } catch (err) {
    res.json(201, {
      result: 0,
      message: 'server error',
      error: err
    });
  }
  // User.findOneById(req.session.user.id)
  // .exec(async (err, user) => {
  // 	var cat = await user.myCategories();
  // 	var sub = await user.mySubCategories();
  // 	console.log('aaaaaaaaaaaaaaa', cat, sub);
  // 	res.json({status: 200, user: cat})
  // })
};

exports.getNeedByIdWithAgreement = (req, res) => {
  try {
    const currentUser = req.session.user;
    ProductNeed.findOneById(req.params.id)
      .populate('category')
      .exec(async (err, need) => {
        if (err) {
          res.json(201, {
            result: 0,
            message: 'server error',
            error: err
          });
        } else if (need) {
          delete need.category.image;
          delete need.category.parentId;
          delete need.category.isActive;
          delete need.category.updatedAt;
          const subCategories = await Category.find({
            where: {
              id: need.subcategories[0]
            }
          }, {
            select: [
              'title',
              'createdAt',
              'id'
            ]
          });
          need.subcategories = subCategories;

          // @TODO get the agreement content from agreement file and set in the agreement.
          need.agreement = 'Agreement text content';

          res.json(200, {
            result: 1,
            data: need
          });
        } else {
          res.json(201, {
            result: 0,
            message: 'Invailid needId'
          });
        }
      });
  } catch (err) {
    res.json(201, {
      result: 0,
      message: 'server error',
      error: err
    });
  }
};

exports.getQuatationsBySeeker = (req, res) => {
  try {
    const parentNeedId = req.params.needId;
    const currentUser = req.session.user;
    const ObjectId = objectIdService.ObjectId;
    ProductNeed.findOne(parentNeedId, function (err, need) {
      if (err || !need) {
        return res.status(201).json({
          result: 0,
          message: 'Need id Invailid'
        });
      }

      //collection.find({$and:[{$or:[{productName:query}]},{status:"active"},{ productType: { $ne: 'requestService' }}]},{productName:1,productType:1,userID:1,location:1,productImgPath:1,createdAt:1,updatedAt:1,id:1,productCategory:1,catagoryID:1,subCategory:1})

      ProductNeed.native((error, collection) => {
        collection.aggregate([
          {
            $match: {
              $and: [{
                $or: [
                  {
                    superParentNeed: new ObjectId(parentNeedId)
                  },
                  {
                    _id: new ObjectId(parentNeedId)
                  }

                ]
              },
              {
                $or: [
                  {
                    providerId: new ObjectId(currentUser.id)
                  },
                  {
                    providerId: null
                  }
                ]
              },
              {
                $or: [
                  {
                    creator: new ObjectId(need.creator)
                  }
                ]
              }]
            }
          },
          {
            $addFields: {
              type: 'need'
            }
          },
          {
            $project: {
              title: 1,
              type: 1,
              // providerId:1,
              // superParentNeed:1,
              // creator:1,
              createdAt: 1
            }
          }
        ]).toArray((err, needs) => {
          if (err) {
            return res.status(201).json({
              result: 0,
              message: 'server error',
              error: err
            });
          }

          if (!needs) {
            return res.status(201).json({
              result: 0,
              message: 'Need not avliable for given provider'
            });
          }

          Quatations.native((error, collection) => {
            collection.aggregate([
              {
                $match: {
                  parentNeedId: new ObjectId(parentNeedId),
                  creator: new ObjectId(currentUser.id)

                }
              },
              {
                $addFields: {
                  type: 'quatation'
                }
              },
              {
                $project: {
                  createdAt: 1,
                  type: 1
                }
              }
            ]).toArray((err, quatation) => {
              if (err) {
                return res.status(201).json({
                  result: 0,
                  message: 'server error',
                  error: err
                });
              }
              let needquatations;
              needquatations = needs;
              if (quatation) {
                needquatations = needs.concat(quatation);
              }

              needquatations = needquatations.sort(function (a, b) {
                return (new Date(b.createdAt) - new Date(a.createdAt));
              });

              res.json(200, {
                result: 1,
                data: needquatations
              });

            });
          });
        });
      });
    });
  } catch (err) {
    res.json(201, {
      result: 0,
      message: 'server error',
      error: err
    });
  }
};

exports.getQatationByProvider = async (req, res) => {

  const parentNeedId = req.params.needId;
  const provider = req.params.providerId;
  const ObjectId = objectIdService.ObjectId;
  try {
    const isProvider = await User.findOneById(provider);
    if (!isProvider) {
      res.status(201).json({
        result: 0,
        message: 'Invailid provider'
      });
    }
    ProductNeed.findOne(parentNeedId, function (err, need) {
      if (err || !need) {
        return res.status(201).json({
          result: 0,
          message: 'Need id Invailid'
        });
      }

      ProductNeed.native((error, collection) => {
        collection.aggregate([
          {
            // $match: {
            //   $or: [
            //     {
            //       superParentNeed: new ObjectId(parentNeedId)
            //     },
            //     {
            //       _id: new ObjectId(parentNeedId)
            //     }
            //   ],
            // }
            $match: {
              $and: [{
                $or: [
                  {
                    superParentNeed: new ObjectId(parentNeedId)
                  },
                  {
                    _id: new ObjectId(parentNeedId)
                  }

                ]
              },
              {
                $or: [
                  {
                    providerId: new ObjectId(provider)
                  },
                  {
                    providerId: null
                  }
                ]
              }]
            }
          },
          {
            $addFields: {
              type: 'need'
            }
          },
          {
            $project: {
              title: 1,
              type: 1,
              createdAt: 1
            }
          }
        ]).toArray((err, needs) => {
          if (err) {
            return res.status(201).json({
              result: 0,
              message: 'server error',
              error: err
            });
          }

          if (!needs) {
            return res.status(201).json({
              result: 0,
              message: 'Need not avliable for given provider'
            });
          }

          Quatations.native((error, collection) => {
            collection.aggregate([
              {
                $match: {
                  $and: [
                    {
                      parentNeedId: new ObjectId(parentNeedId)
                    },
                    {
                      creator: new ObjectId(provider)
                    }
                  ]
                }
              },
              {
                $addFields: {
                  type: 'quatation'
                }
              },
              {
                $project: {
                  type: 1,
                  createdAt: 1
                }
              }
            ]).toArray((err, quatation) => {
              if (err) {
                return res.status(201).json({
                  result: 0,
                  message: 'server error',
                  error: err
                });
              }
              let needquatations;
              needquatations = needs;
              if (quatation) {
                needquatations = needs.concat(quatation);
              }

              needquatations = needquatations.sort(function (a, b) {
                return (new Date(b.createdAt) - new Date(a.createdAt));
              });
              res.json(200, {
                result: 1,
                data: needquatations
              });
            });
          });
        });
      });
    });
  } catch (err) {
    res.json(201, {
      result: 0,
      message: 'server error',
      error: err
    });
  }
};

const __isSubset = (source, target) => {
  return !_.difference(_.flatten(source), _.flatten(target)).length;
};

