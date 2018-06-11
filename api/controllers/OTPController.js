/**
 * OTPController
 *
 * @description :: Server-side logic for managing OTPS
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  generateOTP: (req, res) => {
    OTPService.generateOTP(req, res);
  },
  generateForgotPasswordOTP: (req, res) =>{
    OTPService.generateForgotPasswordOTP(req, res);
  }
};
