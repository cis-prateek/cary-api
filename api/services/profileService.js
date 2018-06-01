var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dqlqezsuz',
  api_key: '876992497762529',
  api_secret: 'SWWMN6ZvofwVdn9evtehTb7Gw0g'
});
// var ObjectId = require('mongodb').ObjectID;

exports.updateProfile = (req, res) => {
  Profile.findOne({
    userId: req.user.id
  }, (err, profile) => {
    if (profile) {
      let body = req.body;
      Profile.update({
        id: profile.id
      }, {
        name: body.name,
        address: body.address,
        city: body.city,
        email: body.email,
        country: body.country,
        unique_quality: body.unique_quality,
        paypal_account: body.paypal_account,
        desc: body.desc,
        nick_name: body.nick_name,
        additional_info: body.additional_info,
        unique_quality: body.unique_quality
      }, function (err, updated) {
        if (err) {
          res.json(200, {
            result: 0,
            message: 'Error occurs',
            error: err
          });
        } else {
          return res.json(200, {
            result: 1,
            data: updated
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
};

exports.getProfile = (req, res) => {
  Profile.findOne({
    userId: req.user.id
  }).exec((err, profile) => {
    if (err) {
      res.json({
        result: 0,
        error: err
      });
    } else {
      return res.json({
        result: 1,
        data: profile
      });
    }
  });
};

exports.getAdminProfile = async (req, res) =>{
  Admin.findOne({
    id: req.user.id
  }).exec((err, profile) => {
    if (err) {
      res.json({
        result: 0,
        error: err
      });
    } else {
      return res.json({
        result: 1,
        data: profile
      });
    }
  });
};

exports.getUserProfileById = (req, res) => {
  Profile.findOne({
    userId: req.params.userId
  }).exec((err, profile) => {
    if (err) {
      res.json({
        result: 0,
        error: err
      });
    } else {
      return res.json({
        result: 1,
        data: profile
      });
    }
  });
};

exports.uploadPortfolio = async (req, res) => {
  try {
    const uploader = new AvatarUploader();
    Profile.findOne({
      userId: req.user.id
    }, (err, profile) => {
      if (profile) {
        req.file('portfolioImages').upload({
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
              const files = profile.portfolioImages;
              files.push({
                id: result.public_id,
                url: result.url
              });
              await Profile.update(profile.id, {
                portfolioImages: files
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

exports.removePortfolio = async (req, res) => {
  const imagesId = req.body.portfolioImages;
  try {
    if (!imagesId || !imagesId.length) {
      res.status(201).json({
        result: 0,
        message: 'Image Ids required.'
      });
    }
    const uploader = new AvatarUploader();
    Profile.findOne({
      userId: req.user.id
    }, async (err, profile) => {
      if (profile) {
        let images = profile.portfolioImages;
        let portfolioImages = [];
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
            Profile.update({
              'userId': req.user.id
            }, {
              portfolioImages: images
            }, (errrrr, reesss) => {
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

exports.checkSubRegistration = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOneById(userId);
    if(!user) {
      res.status(201).json({
        result: 0,
        message: 'Invailid user'
      });
    }
    const result = await UsersCategories.find({
      user_id: userId
    });
    if (result.length) {
      return res.status(200).json({
        result: 1,
        message: 'Sub-registration found',
        data: result,
        isFound: true,
        isProvider: user.isProvider
      });
    } else {
      return res.status(201).json({
        result: 1,
        message: 'sub registration not found',
        isFound: false,
        isProvider: user.isProvider
      });
    }
  } catch (e) {
    return res.status(201).json({
      result: 0,
      error: e,
      message: 'Error occurs'
    });
  }
};
