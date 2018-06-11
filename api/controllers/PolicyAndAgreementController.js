/**
 * OTPController
 *
 * @description :: Server-side logic for managing OTPS
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  uploadPolicyOrAgreement: (req, res) => {
    policyAndAgreementService.uploadPolicyOrAgreement(req, res);
  },
  downloadAgreement: (req, res) => {
    policyAndAgreementService.downloadAgreement(req, res);
  },
  getNameOfFile: (req, res) => {
    policyAndAgreementService.getNameOfFile(req, res);
  }
};
