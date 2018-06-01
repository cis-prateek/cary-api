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
    // upload later on form submit or something similar
    scope.disableSave = false;
    scope.uploadSliderImages = () => {
      if (scope.formData.$valid) {
        scope.disableSave = true;
        const data = {
          title: scope.formData.title.$viewValue,
          description: scope.formData.description.$viewValue,
          images: scope.formData.file.$viewValue
        };
        scope.upload(data);
      } else {
        // scope.errorMessage = 'All fileds required';
        notificationService.error('All fileds required.');
      }
    };

    // upload on file select or drop
    scope.upload = function (data) {
      Upload.upload({
        url: '/api/sliderimages',
        data: data
      }).then((resp) => {
        notificationService.success('Slider Images added successfully.');
        state.go('admin.slider-images');
        scope.disableSave = false;
      }, (resp) => {
        scope.disableSave = false;
        notificationService.error('Error occurs while slider images added. Please try again later');
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
          notificationService.error('Unable to get the slider images information.');
        });
    };
    scope.getSliderImages();
    scope.removeImage = (image) => {
      httpService
        .deleteData(`/api/sliderimage/${image.id}`)
        .success((response, status, headers, config) => {
          if (response.result) {
            notificationService.success('Slider images removed successfully');

            const filteredArray = _.filter(scope.allSliderImages, (o) => o.id !== image.id);
            scope.allSliderImages = filteredArray;
          }
        })
        .error(function (error, status, headers, config) {
          notificationService.error('Error occurs, Unable to remove slider images.');
          console.log('error', error);
        });
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
