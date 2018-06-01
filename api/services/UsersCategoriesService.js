const async = require('async');
const _ = require('lodash');

exports.saveUserCategoriesWithTags = (req, res) => {
  const body = req.body;
  if (!body.tags_info) {
    return res.status(201).json({
      result: 0,
      message: 'Category tags informations required'
    });
  }

  if (!body.user_info) {
    return res.status(201).json({
      result: 0,
      message: 'User informations required'
    });
  }
  async.series([
    (callback1) => {
      UsersCategories.findOne({
        user_id: req.user.id
      }).exec((err, resp) => {
        const tags_info = body['tags_info'];
        tags_info['user_id'] = req.user.id;
        if (err) {
          callback1(err);
        } else if (resp) {
          UsersCategories.update({
            user_Id: req.user.id
          }, tags_info).exec((err, response) => {
            if (err) {
              callback1(err);
            } else {
              callback1();
            }
          });
        } else {
          UsersCategories.create(
            tags_info
          ).exec((err, response) => {
            if (err) {
              callback1(err);
            } else {
              callback1();
            }
          });
        }
      });
    }, (callback2) => {
      Profile.findOneByPhoneNumber(req.user.phoneNumber, (err, profile) => {
        if (profile) {
          const userInfo = body.user_info;
          profile['email'] = userInfo.email || '';// only for PROVIDER
          profile['city'] = userInfo.city || '';// only for PROVIDER
          profile['address'] = userInfo.address || '';// only for PROVIDER
          profile['country'] = userInfo.country || '';// only for PROVIDER
          profile['unique_quality'] = userInfo.unique_quality || '';// only for PROVIDER
          profile['name'] = userInfo.name || '';// only for PROVIDER
          profile['additional_info'] = userInfo.additional_info || '';// only for PROVIDER
          profile['desc'] = userInfo.desc || '';
          profile['nick_name'] = userInfo.nick_name || '';
          Profile.update(profile.id, profile).exec((err, profile) => {
            if (err) {
              callback2(err);
            } else {
              callback2();
            }
          });
        } else {
          callback2(err);
        }
      });
    }
  ],
  (error, response) => {
    if (error) {
      return res.status(201).json({
        result: 0,
        message: 'Error Occurs',
        error: error
      });
    } else {
      return res.status(200).json({
        result: 1,
        message: 'Successfully saved'
      });
    }
  });
};

exports.getUserCategoriesWithSubCategories = async (req, res) => {
  const userId = req.params.userId;
  try {
    const doc = await UsersCategories.findOne({
      user_id: userId
    });

    const allUserCategories = doc.categories;
    let docArray = [];
    async.forEach(Object.keys(allUserCategories), async (index, cb) => {
      if (allUserCategories[index]) {
        const valDoc = Object.assign({
        }, allUserCategories[index]);
        const category = await Category.findOneById(valDoc.category_id);
        const subCategory = await Category.find({
          where: {
            id: valDoc.tags
          }
        });
        valDoc.category = category;
        valDoc.subCategory = subCategory;
        delete valDoc.category_id;
        delete valDoc.tags;
        docArray.push(valDoc);
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
  } catch (e) {
    res.status(201).json({
      result: 0,
      error: e,
      message: 'Error Occurs'
    });
  }
};
