const papercut = require('papercut');
const async = require('async');

papercut.configure(function () {
  papercut.set('storage', 'file');
  papercut.set('directory', './api/uploads');
  papercut.set('url', '/api/uploads');
});

// var ObjectId = require('mongodb').ObjectID;
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dqlqezsuz',
  api_key: '876992497762529',
  api_secret: 'SWWMN6ZvofwVdn9evtehTb7Gw0g'
});
// papercut.configure('production', function(){
//   papercut.set('storage', 's3')
//   papercut.set('S3_KEY', process.env.S3_KEY)
//   papercut.set('S3_SECRET', process.env.S3_SECRET)
//   papercut.set('bucket', 'papercut')
// });

AvatarUploader = papercut.Schema(function (schema) {
  // schema.version({
  //   name: 'avatar',
  //   size: '200x200',
  //   process: 'crop'
  // });

  // schema.version({
  //   name: 'small',
  //   size: '50x50',
  //   process: 'crop'
  // });
});

exports.getActiveCategories = function (req, res) {
  Category.find({
    parentId: null,
    isActive: true
  }, (err, catList) => {
    if (err) {
      res.json(201, {
        result: 0,
        error: err
      });
    } else {
      res.json(200, {
        result: 1,
        data: catList
      });
    }
  });
};

exports.getAllCategories = async (req, res) => {
  let response;
  try {
    response = await Category.find({
      parentId: null
    });
  }
  catch (err) {
    return res.status(201).json({
      result: 0,
      error: err
    });
  }
  res.status(200).json({
    result: 1,
    data: response
  });
};

exports.getActiveSubCategories = function (req, res) {
  try {
    Category.find({
      parentId: req.params.id,
      isActive: true
    }, (err, subCatList) => {
      if (err) {
        res.json(201, {
          result: 0,
          error: err
        });
      } else {
        res.json(200, {
          result: 1,
          data: subCatList
        });
      }
    });
  }
  catch (e) {
    res.json(500, e);
  }
};

exports.getAllSubCategories = async (req, res) => {
  let response;
  try {
    response = await Category.find({
      parentId: req.params.id
    });
  }
  catch (err) {
    res.json(201, {
      result: 0,
      error: err
    });
  }
  res.json(200, {
    result: 1,
    data: response
  });
};

exports.addCategory = function (req, res) {
  const uploader = new AvatarUploader();
  let body = req.body;
  req
    .file('image').upload({
      maxBytes: 10000000
    }, async function whenDone (err, uploadedFiles) {
      if (err) {
        return res.negotiate(err);
      }
      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0) {
        return res.badRequest('Category image required');
      }
      await uploadedFiles.forEach((file) => {
        cloudinary.uploader.upload(file.fd, (result) => {
          const image = {
            id: result.public_id,
            url: result.url
          };
          body.image = image;
          if (body.parentId) {
            Category.findOneById(body.parentId).exec((err, cat) => {
              if (err) {
                res.json(200, {
                  result: 0,
                  error: err,
                  message: 'Invaild Category Id'
                });
              } else {
                Category.create(req.body, (err, cat) => {
                  if (err) {
                    return res.json(201, {
                      result: 0,
                      error: err
                    });
                  } else {
                    return res.json(200, {
                      result: 1,
                      data: cat
                    });
                  }
                });
              }
            });
          } else {
            Category.create(req.body, (err, cat) => {
              if (err) {
                return res.json(201, {
                  result: 0,
                  error: err
                });
              } else {
                return res.json(200, {
                  result: 1,
                  data: cat
                });
              }
            });
          }
        });
      });
    });
};

exports.getActiveCategoryWithTags = (req, res) => {
  Category.find({
    parentId: null,
    isActive: true
  })
    .populate('subCategories')
    .exec(function (err, categories) {
      if (err) {
        res.json(201, {
          result: 0,
          error: err
        });
      } else {
        return res.json({
          result: 1,
          data: categories
        });
      }
    });
};

exports.updateCategory = async (req, res) => {
  const id = req.params.id;
  try {
    category = await Category.findOneById(id);
    if (!category) {
      return res.status(404).json({
        result: 0,
        message: 'Record not found to update.'
      });
    }
    const response = await Category.update(category.id, req.body);
  }
  catch (e) {
    res.status(201).json({
      result: 0,
      error: e,
      message: 'Error occurs.'
    });
  }
  res.status(200).json({
    result: 1,
    message: 'Successfully updated.'
  });
};

exports.getCategoryProviders = (req, res) => {
  const ObjectId = objectIdService.ObjectId;
  UsersCategories.native((err, collection) => {
    collection.find().toArray((error, response) => {
      // console.log('-----------error, response--------', error, response);
    });
  });

  UsersCategories
    .find()
    .exec((err, userCategories) => {
      if (err) {
        res.json(201, {
          result: 0,
          error: err
        });
      } else {
        const providerIds = [];
        async.each(userCategories, (cats, call) => {
          async.each(cats.categories, (cat, callback) => {
            if (req.params.categoryId == cat.category_id) {
              providerIds.push(new ObjectId(cats.user_id));
            }
            callback();
          }, (err) => {
            call();
          });
        }, (err) => {
          const limit = req.body.limit,
            skip = req.body.skip;
          Category.findOneById(req.params.categoryId)
            .exec((err, category) => {
              User
                .find({
                  where: {
                    _id: {
                      $in: providerIds
                    },
                    isProvider: true
                  },
                  skip: Number(skip),
                  limit: Number(limit)
                })
                .populate('userProfile')
                .exec((err, providers) => {
                  category.providers = providers;

                  return res.json({
                    result: 1,
                    data: category
                  });
                });
            });
        });
      }
    });
};

exports.getUserActiveCategories = async (req, res) => {
  const currentUser = req.session.user;
  try {
    if (!currentUser) {
      return res.status(201).json({
        result: 0,
        message: 'Authentication Error'
      });
    };
    const doc = await UsersCategories.findOne({
      user_id: currentUser.id
    });
    const allUserCategories = doc.categories;
    let docArray = [];
    async.forEach(Object.keys(allUserCategories), async (index, cb) => {
      if (allUserCategories[index]) {
        const valDoc = Object.assign({
        }, allUserCategories[index]);
        const category = await Category.findOneById(valDoc.category_id);
        // valDoc.category = category;
        // delete valDoc.category_id;
        // delete valDoc.tags;
        docArray.push(category);
        setTimeout(() => {
          if (cb) {
            cb();
          }
        }, 0);
      }
    }, (error, repon) => {
      res.json({
        result: 1,
        data: docArray
      });
    });
  } catch (err) {
    res.status(201).json({
      result: 0,
      error: err,
      message: 'Error Occurs'
    });
  }
};

exports.getUserActiveSubCategories = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findOneById(categoryId);
    if (!category) {
      return res.status(201).json({
        result: 0,
        message: 'Category not found'
      });
    }

    Category.find({
      parentId: req.params.id,
      isActive: true
    }, (err, subCatList) => {
      if (err) {
        res.json(201, {
          result: 0,
          error: err
        });
      } else {
        res.json(200, {
          result: 1,
          data: subCatList
        });
      }
    });
  }
  catch (err) {
    res.status(201).json({
      result: 0,
      error: err,
      message: 'Error Occurs'
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findOneById(categoryId);
    if (!category) {
      return res.status(201).json({
        result: 0,
        message: 'Invailid category Id.'
      });
    } else {
      return res.json({
        result: 1, data: category
      });
    }
  } catch (e) {
    res.status(201).json({
      result: 1,
      error: e,
      message: 'Error occurs.'
    });
  }
};

exports.deleteById = async (req, res) => {

  try {
    const categoryId = req.params.id;

    const category = await Category.findOneById(categoryId);
    if (!category) {
      return res.status(201).json({
        result: 0,
        message: 'Invailid category Id.'
      });
    }

    const isUserAssociatedWithCategory = await UsersCategories.findOneById({
      categories: categoryId
    });

    if (isUserAssociatedWithCategory) {
      return res.status(201).json({
        result: 0,
        message: 'Category Used, Category in use.'
      });
    }

    const isProductNeedAssociatedWithCategory = await ProductNeed.findOne({
      category: categoryId
    });

    if (isUserAssociatedWithCategory) {
      return res.status(201).json({
        result: 0,
        message: 'Category Used, Category in use.'
      });
    }

    const isQuestionBunchAssociatedWithCategory = await QuestionBunch.findOne({
      category: categoryId
    });

    if (isQuestionBunchAssociatedWithCategory) {
      return res.status(201).json({
        result: 0,
        message: 'Category Used, Category in use.'
      });
    }

    const isQuestionsAssociatedWithCategory = await Questions.findOne({
      categoryId
    });

    if (isQuestionsAssociatedWithCategory) {
      return res.status(201).json({
        result: 0,
        message: 'Category Used, Category in use.'
      });
    }
  }
  catch (e) {
    res.status(201).json({
      result: 1,
      error: e,
      message: 'Error occurs.'
    });
  }
};
