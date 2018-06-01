var cloudinary = require('cloudinary');
const fs = require('fs');
const uploadDirPath = `${__dirname}/../../assets/uploads`;
const path = require('path');

cloudinary.config({
  cloud_name: 'dqlqezsuz',
  api_key: '876992497762529',
  api_secret: 'SWWMN6ZvofwVdn9evtehTb7Gw0g'
});

exports.getNameOfFile = async (req, res) => {
  let existFileName;
  fs.readdir(`${uploadDirPath}`, (err, files) => {
    files.forEach(file => {
      let fileNameSplit = file.split('.');
      if (fileNameSplit.length && fileNameSplit[0] === req.params.fileName) {
        return res.status(200).json({
          result: file
        });
      }
    });
  });
};

exports.uploadPolicyOrAgreement = async (req, res) => {
  try {
    const fileName = req.file('file')._files[0].stream.filename,
      fileNameSplit = fileName.split('.'),
      fileExtention = fileNameSplit[fileNameSplit.length - 1];
    let existFileName = '';
    fs.readdir(`${uploadDirPath}`, (err, files) => {
      files.forEach(file => {
        let fileNameSplit = file.split('.');
        if (fileNameSplit.length && fileNameSplit[0] === req.params.type) {
          existFileName = file;
        }
      });
    });
    await req.file('file').upload({
      maxBytes: 10000000,
      dirname: uploadDirPath,
      saveAs: function (__newFileStream, cb) {
        let uniqueName = `${req.params.type}.${fileExtention}`;
        cb(null, uniqueName);
      }
    }, async function whenDone (err, uploadedFiles) {
      if (!uploadedFiles.length) {
        return res.status(201).json({
          result: 0,
          message: 'File not Uploaded, Please try again.',
          error: err
        });
      }
      if (
        existFileName !== `${req.params.type}.${fileExtention}` &&
        existFileName &&
        fs.existsSync(`${uploadDirPath}/${existFileName}`)
      ) {
        fs.unlinkSync(`${uploadDirPath}/${existFileName}`);
      }

      return res.status(200).send({
        result: 1,
        message: 'Successfully Uploaded'
      });
    });
  } catch (e) {

    return res.status(201).json({
      result: 0,
      message: 'Internal server error!',
      error: e
    });
  }
};

exports.downloadAgreement = async (req, res) => {
  const fileName = req.params.fileName;
  try {
    const filePath = `${uploadDirPath}/${fileName}`;
    const isFileAvailable = fs.existsSync(filePath);
    if (!isFileAvailable) {
      return res.status(201).json({
        result: 0,
        message: 'File Not Available'
      });
    }

    // var file = fs.readFileSync(`${uploadDirPath}/${fileName}`, 'binary');

    // res.setHeader('Content-Length', file.length);
    // res.write(file, 'binary');
    // res.end();

    // var pdfreader = require('pdfreader');
    // new PdfReader().parseFileItems("sample.pdf", function(err, item){
    //   if (err)
    //     callback(err);
    //   else if (!item)
    //     callback();
    //   else if (item.text)
    //     console.log(item.text);
    // });
    var SkipperDisk = require('skipper-disk');
    var fileAdapter = SkipperDisk(/* optional opts */);
    //var dataMessage = "";
    var read = require('read-file');
    var buffer = read.sync(`${uploadDirPath}/${fileName}`, {
      encoding: 'utf8'
    });
    //console.log(buffer)
    // var data = fileAdapter.read(`${uploadDirPath}/${fileName}`)
    //   .on('error', function (err){
    //     console.log(err)
    //     dataMessage = err;
    //   }).on("success",function (data) {
    //     dataMessage = data;
    //     console.log(data);
    //   })
    //   .pipe(res);
    //console.log("data:: ",data);

    return res.status(200).json({
      result: 1,
      data: buffer
    });
  } catch (e) {
    console.log('---------------', e);

    return res.status(201).json({
      result: 0,
      message: 'Internal server error!',
      error: e
    });
  }
};
