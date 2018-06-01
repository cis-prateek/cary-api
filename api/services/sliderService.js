var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dqlqezsuz',
  api_key: '876992497762529',
  api_secret: 'SWWMN6ZvofwVdn9evtehTb7Gw0g'
});

exports.saveSliderImages = async (req, res) => {
  try {
    const uploader = new AvatarUploader();
    const files = await req.file('images');
    if (!files || !files._files || !files._files.length) {
      return res.status(201).json({
        result: 0,
        message: 'File required'
      });
    } else {
      req.file('images').upload({
        maxBytes: 10000000
      }, async function whenDone (err, uploadedFiles) {
        if (!uploadedFiles.length) {
          return res.status(201).json({
            result: 0,
            message: 'Internal server error!',
            error: err
          });
        }
        async.forEach(uploadedFiles, async (file, callback) => {
          const result = await cloudinary.uploader.upload(file.fd);
          if (result) {
            await SliderImage.create({
              cloudId: result.public_id,
              url: result.url,
              title: req.body.title,
              description: req.body.description
            });
          }
          callback();
        }, (err) => {
          return res.status(200).json({
            result: 1,
            message: 'Successfully Uploaded'
          });
        });

      });
    }
  } catch (e) {
    return res.status(201).json({
      result: 0,
      message: 'Internal server error!',
      error: e
    });
  }
};

exports.getSliderImages = async (req, res) => {
  let response = [];
  try {
    response = await SliderImage.find({
    });
    res.status(200).send({
      result: 1,
      data: response
    });
  }
  catch (e) {
    res.status(500).send({
      result: 0,
      message: 'Internal server error!',
      error: e
    });
  }
};

exports.deleteSliderImage = async (req, res) => {
  let response;
  const id = req.params.id;
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json('Not Authenticated User.');
    }

    const sliderImage = await SliderImage.findOneById(id);
    if (!sliderImage) {
      return res.status(404).json({
        result: 0,
        message: 'Invailid slider image id'
      });
    }

    await SliderImage.destroy({
      id
    });

    res.status(200).send({
      result: 1,
      message: 'Removed Successfully.'
    });
  }
  catch (e) {
    res.status(500).send({
      result: 0,
      message: 'Internal server error!',
      error: e
    });
  }
};
