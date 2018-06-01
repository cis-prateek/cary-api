/**
 * SliderImageController
 *
 * @description :: Server-side logic for managing sliderimages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  saveSliderImages: function (req, res) {
    sliderService.saveSliderImages(req, res);
  },

  getSliderImages: function (req, res) {
    sliderService.getSliderImages(req, res);
  },
  deleteSliderImage: (req, res) =>{
    sliderService.deleteSliderImage(req, res);
  }
};
