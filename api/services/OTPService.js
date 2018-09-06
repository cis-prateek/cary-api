const sql = require("mssql");
const axios = require("axios");

exports.generateOTP = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  let response;
  try {
    if (!phoneNumber) {
      return res.status(201).json({
        result: 0,
        message: "Phone Number required."
      });
    }
    const user = await User.findOne({
      phoneNumber
    });

    if (user) {
      return res.status(201).json({
        result: 0,
        message: "Phone number already registered."
      });
    }
    response = await __createOTP(response, phoneNumber, "registration");
  } catch (e) {
    return res.status(201).json({
      result: 0,
      error: e,
      message: "Error occurs."
    });
  }

  const optResponse = await __sendSMS(response[0]);

  if (optResponse) {
    res.status(200).json({
      result: 1,
      message: `OTP successfully generated and send to the following Number ${phoneNumber}`
    });
  } else {
    return res.status(201).json({
      result: 0,
      error: null,
      message: "Error occured while sending the OTP"
    });
  }
};

exports.generateForgotPasswordOTP = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  let response;
  try {
    if (!phoneNumber) {
      return res.status(201).json({
        result: 0,
        message: "Phone Number required."
      });
    }

    const user = await User.findOne({
      phoneNumber
    });

    if (!user) {
      return res.status(201).json({
        result: 0,
        message: "Phone number doesn't exists."
      });
    }

    response = await __createOTP(response, phoneNumber, "forgot-pass");
  } catch (e) {
    return res.status(201).json({
      result: 0,
      error: e,
      message: "Error occurs."
    });
  }

  const optResponse = await __sendSMS(response[0]);

  if (optResponse) {
    res.status(200).json({
      result: 1,
      message: `OTP successfully generated and send to the following Number ${phoneNumber}`
    });
  } else {
    return res.status(201).json({
      result: 0,
      error: null,
      message: "Error occured while sending the OTP"
    });
  }
};

const __createOTP = async (response, phoneNumber, type) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  // const otp = "123456";
  const OTPInfo = await OTP.findOne({
    phoneNumber,
    type
  });
  if (OTPInfo) {
    response = await OTP.update(
      {
        phoneNumber,
        type
      },
      { otp }
    );
  } else {
    response = await OTP.create({
      phoneNumber,
      otp,
      type
    });
  }

  return response;
};

const __sendSMS = async ({ otp, phoneNumber }) => {
  try {
    const pool = await sql.connect(
      "mssql://jxc_kf:ctkf0929@180.76.245.133:30003/ctkf_manager"
    );

    const result = await pool
      .request()
      .input("as_ren_code", sql.VarChar, 1)
      .input("as_ren_msg", sql.VarChar, "test")
      .execute("p_phone_rpt_Get_SMSApi_urlAccountPwd");

    const { recordset } = result;
    const [data] = recordset;
    sql.close();
    const { httpUrl, account, password } = data;

    const url = `${httpUrl}?username=${account}&password=${password}&to=[mobile]${phoneNumber}[mobile!][content]${otp}[content!]&text=The OTP is:&subid=&msgtype=1&encode=0&version=`;

    try {
      const { data } = await axios.get(url);
      if (data === 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  } catch (err) {
    return false;
  }
};
