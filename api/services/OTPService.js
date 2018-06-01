exports.generateOTP = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  let response;
  try {
    if (!phoneNumber) {
      return res.status(201).json({
        result: 0,
        message: 'phoneNumber required'
      });
    }
    const user = await User.findOne({
      phoneNumber
    });

    if(user) {
      return res.status(201).json({
        result: 0,
        message: 'Phone number already registered.'
      });
    }
    response = await __createOTP(response, phoneNumber, 'registration');
  }
  catch (e) {
    return res.status(201).json({
      result: 0,
      error: e,
      message: 'Error occurs.'
    });
  }
  // @TODO write code to send the otp to the phone number.
  res.status(200).json({
    result: 1,
    message: `OTP successfully generated and send to ${phoneNumber} Phone Number.`
  });
};

exports.generateForgotPasswordOTP = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  let response;
  try {
    if (!phoneNumber) {
      return res.status(201).json({
        result: 0,
        message: 'phoneNumber required'
      });
    }

    const user = await User.findOne({
      phoneNumber
    });

    if(!user) {
      return res.status(201).json({
        result: 0,
        message: 'Phone number doesn\'t exists'
      });
    }

    response = await __createOTP(response, phoneNumber, 'forgot-pass');
  }
  catch (e) {
    return res.status(201).json({
      result: 0,
      error: e,
      message: 'Error occurs.'
    });
  }
  // @TODO write code to send the otp to the phone number.

  res.status(200).json({
    result: 1,
    message: `OTP successfully generated and send to ${phoneNumber} Phone Number.`
  });
};
const __createOTP = async (response, phoneNumber, type) =>{
  // const otp = Math.floor(100000 + Math.random() * 900000);
  const otp = '123456';
  const OTPInfo = await OTP.findOne({
    phoneNumber,
    type
  });
  if (OTPInfo) {
    response = await OTP.update({
      phoneNumber,
      type
    }, {
      otp
    });
  } else {
    response = await OTP.create({
      phoneNumber,
      otp,
      type
    });
  }

  return response;
};
