// const papercut = require('papercut');
// papercut.configure(function () {
//     papercut.set('storage', 'file')
//     papercut.set('directory', `./api/uploads`)
//     papercut.set('url', '/api/uploads')
// });

// // papercut.configure('production', function(){
// //   papercut.set('storage', 's3')
// //   papercut.set('S3_KEY', process.env.S3_KEY)
// //   papercut.set('S3_SECRET', process.env.S3_SECRET)
// //   papercut.set('bucket', 'papercut')
// // });

// AvatarUploader = papercut.Schema(function (schema) {
//     schema.version({
//         name: 'avatar',
//         size: '200x200',
//         process: 'crop'
//     });

//     schema.version({
//         name: 'small',
//         size: '50x50',
//         process: 'crop'
//     });
// });
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dqlqezsuz',
  api_key: '876992497762529',
  api_secret: 'SWWMN6ZvofwVdn9evtehTb7Gw0g'
});

exports.signup = async (req, res) => {
  let body = req.body;
  try {
    if (!body.otp) {
      return res.status(201).json({
        result: 0,
        message: 'OTP Required.'
      });
    }

    const query = {
      phoneNumber: body.phoneNumber,
      otp: body.otp,
      type: 'registration'
    };

    const user = await User.findOne({
      phoneNumber: new String(body.phoneNumber)
    });
    if (user) {
      await __destroyOTPEntry(query);

      return res.status(201).json({
        result: 0,
        message: 'User already registered.'
      });
    }

    const OTPInfo = await OTP.findOne(query);
    if (!OTPInfo) {
      return res.status(201).json({
        result: 0,
        message: 'Invalid OTP Number.'
      });
    }

    User.create({
      password: body.password,
      phoneNumber: body.phoneNumber,
      isProvider: body.isProvider
    }, async (err, user) => {
      if (err) {
        res.status(201).json({
          result: 0,
          error: err,
          message: 'Error Occurs, Please try again.'
        });
      } else {
        await __destroyOTPEntry(query);
        req.session.user = user;

        return res.status(201).json({
          result: 1,
          data: user
        });
      }
    });
  }
  catch (e) {
    return res.status(201).json({
      result: 0,
      error: e,
      message: 'Error Occurs.'
    });
  }
};

const __destroyOTPEntry = async (info) => {
  try {
    await OTP.destroy(info);
  }
  catch (e) {
    return false;
  }

  return true;
};

exports.uploadAvatar = (req, res) => {
  const uploader = new AvatarUploader();
  const mediaFile = req.file('avatar');

  if (!mediaFile._files[0]) {
    clearTimeout(mediaFile.timeouts.untilMaxBufferTimer);
    clearTimeout(mediaFile.timeouts.untilFirstFileTimer);

    return res.status(201).json({
      result: 0,
      message: 'no file uplaoaded!.'
    });
  }

  try {
    req.file('avatar').upload({
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
          message: 'No file was uploaded.'
        });
      }

      const userProfile = await Profile.findOne({
        userId: req.session.user.id
      });

      cloudinary.uploader.upload(uploadedFiles[0].fd, (result) => {
        Profile.update({
          userId: req.session.user.id
        }, {
          avatarUrl: result.url,
          avatarFd: `${result.original_filename}`,
          avatarId: `${result.public_id}`
        }).exec(async (error, response) => {
          if (error) {
            return res.status(201).json({
              result: 0,
              message: 'Error Occurs.',
              error: error
            });
          } else {
            if (userProfile.avatarId) {
              await cloudinary.uploader.destroy(userProfile.avatarId);
            }

            return res.status(200).send({
              result: 1,
              message: 'Successfully Uploaded.',
              data: {
                avatarUrl: result.url || ''
              }
            });
          }
        });
      });
    });
  }
  catch (e) {

    res.status(201).send({
      result: 0,
      error: e,
      message: 'Server Error'
    });
  }
};

/**
 * GET avatar of the user.
 * (GET /user/avatar/)
 */
exports.avatar = function (req, res) {

  Profile.findOne({
    userId: req.user.id
  }).exec(function (err, profile) {
    if (err) {
      return res.jsn({
        result: 0,
        error: err
      });
    }

    if (!profile) {
      return res.send({
        result: 0,
        message: 'User image not Available.'
      });
    }

    if (!profile.avatarUrl) {
      return res.send({
        result: 0,
        message: 'User image not Available.'
      });
    }

    return res.status(201).json({
      result: 1,
      data: {
        avatarUrl: profile.avatarUrl
      }
    });
  });
};

exports.getAllUsers = async (req, res) => {
  let response;
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({
        result: 0,
        message: 'Not Authrized'
      });
    }
    response = await User.find({
    }, {
      select: [
        'phoneNumber',
        'isProvider',
        'createdAt',
        'id',
        'userProfile.desc'
      ]
    }).populate('userProfile');
  }
  catch (e) {

    return res.status(503).json({
      result: 0,
      message: 'Server Error'
    });
  }

  return res.status(201).json({
    result: 1,
    data: response
  });
};

exports.changePassword = async (req, res) => {
  let response;

  const phoneNumber = req.body.phoneNumber,
    oldPassword = req.body.oldPassword,
    newPassword = req.body.newPassword;

  try {
    const user = await User.findOne({
      phoneNumber
    });

    if (!user) {
      return res.status(201).json({
        result: 0,
        message: 'Invailid userId'
      });
    }

    const isValidPassword = await user.checkPasswordMatch(oldPassword, user);
    if (!isValidPassword) {
      return res.status(201).json({
        result: 0,
        message: 'Incorrect old password.'
      });
    }

    delete user.id;
    await User.update(user.id, {
      password: newPassword
    });
  }
  catch (e) {
    return res.status(503).json({
      result: 0,
      message: 'Server Error'
    });
  }

  return res.status(201).json({
    result: 1,
    message: 'Password changed successfully.'
  });
};
