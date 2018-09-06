'use strict';

app.controller('sliderImageCtrl', [
  '$scope',
  'httpService',
  'Upload',
  'toaster',
  '$state',
  'notificationService',
  (
    scope,
    httpService,
    Upload,
    toaster,
    state,
    notificationService
  ) => {

    var lang = {
      'en': {
        ALL_FIELDS_REQUIRED: 'All fileds required.',
        SLIDER_IMAGE_ERROR: 'Error occurs while slider images added. Please try again later',
        SLIDER_IMAGE_SUCCESS: 'Slider Images added successfully.',
        UNABLE_TO_GET_IMAGES: 'Unable to get the slider images information.',
        IMAGES_REMOVED: 'Slider images removed successfully',
        IMAGES_REMOVE_ERROR: 'Error occurs, Unable to remove slider images.'

      },
      'ch': {
        ALL_FIELDS_REQUIRED: '所有文件都需要。',
        SLIDER_IMAGE_ERROR: '添加滑块图像时发生错误。请稍后再试',
        SLIDER_IMAGE_SUCCESS: '滑块图像添加成功。',
        UNABLE_TO_GET_IMAGES: '无法获取滑块图像信息。',
        IMAGES_REMOVED: '成功移除滑块图像',
        IMAGES_REMOVE_ERROR: '发生错误，无法移除滑块图像。'

      }
    };

    scope.titleError = false;
    scope.titleChError = false;
    scope.descError = false;
    scope.descChError =false;
    scope.imageError = false;

    // upload later on form submit or something similar
    scope.disableSave = false;
    scope.uploadSliderImages = () => {
      if (scope.formData.$valid && scope.formData.title.$viewValue && scope.formData.title_ch.$viewValue && scope.formData.description.$viewValue && scope.formData.description_ch.$viewValue && scope.formData.file.$viewValue) {
        scope.disableSave = true;
        const data = {
          title: scope.formData.title.$viewValue,
          title_ch: scope.formData.title_ch.$viewValue,
          description: scope.formData.description.$viewValue,
          description_ch: scope.formData.description_ch.$viewValue,
          images: scope.formData.file.$viewValue
        };
        scope.upload(data);
      } else {
        if(!scope.formData.title.$viewValue){
          scope.titleError = true;
        }
        if(!scope.formData.description.$viewValue){
          scope.descError = true;
        }
        if(!scope.formData.title_ch.$viewValue){
          scope.titleChError = true;
        }
        if(!scope.formData.description_ch.$viewValue){
          scope.descChError = true;
        }
        if(!scope.formData.file.$viewValue){
          scope.imageError = true;
        }
      }
    };

    // upload on file select or drop
    scope.upload = function (data) {
      Upload.upload({
        url: '/api/sliderimages',
        data: data
      }).then((resp) => {
        notificationService.success(lang[scope.selectedLang].SLIDER_IMAGE_SUCCESS);
        state.go('admin.slider-images');
        scope.disableSave = false;
      }, (resp) => {
        scope.disableSave = false;
        notificationService.error(lang[scope.selectedLang].SLIDER_IMAGE_ERROR);
      }, (evt) => {
        // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      });
    };

    scope.allSliderImages = [];
    scope.getSliderImages = () => {
      httpService.getData('/api/sliderimages')
        .success((response, status, headers, config) => {
          if (response.result) {
            scope.allSliderImages = response.data;
          }
        })
        .error(function (error, status, headers, config) {
          console.log('error', error);
          notificationService.error(lang[scope.selectedLang].UNABLE_TO_GET_IMAGES);
        });
    };
    scope.getSliderImages();
    scope.removeImage = (image) => {
      httpService
        .deleteData(`/api/sliderimage/${image.id}`)
        .success((response, status, headers, config) => {
          if (response.result) {
            notificationService.success(lang[scope.selectedLang].IMAGES_REMOVED);

            const filteredArray = _.filter(scope.allSliderImages, (o) => o.id !== image.id);
            scope.allSliderImages = filteredArray;
          }
        })
        .error(function (error, status, headers, config) {
          notificationService.error(lang[scope.selectedLang].IMAGES_REMOVE_ERROR);
          console.log('error', error);
        });
    };

    scope.updateField = function (field){
      switch(field) {
      case 'title':
        scope.titleError = ! scope.formData.title.$viewValue.trim();
        break;
      case 'title_ch':
        scope.titleChError = ! scope.formData.title_ch.$viewValue.trim();
        break;
      case 'description':
        scope.descError = ! scope.formData.description.$viewValue.trim();
        break;
      case 'description_ch':
        scope.descChError = ! scope.formData.description_ch.$viewValue.trim();
        break;
      case 'image':
        scope.imageError = !scope.formData.file.$viewValue;
        break;
      default:
        break;
      }
    };

    // scope.pop = function () {
    //   toaster.success({
    //     title: 'title', body: 'text1'
    //   });
    //   toaster.error('title', 'text2');
    //   toaster.pop({
    //     type: 'wait', title: 'title', body: 'text'
    //   });
    //   scope.clear = function () {
    //     toaster.clear();
    //   };
    // };
  }

]);
