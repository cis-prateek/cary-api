'use strict';

app.controller('newsFeedsController', [
  '$scope',
  'httpService',
  'Upload',
  'toaster',
  '$state',
  '$stateParams',
  'notificationService',
  (
    scope,
    httpService,
    Upload,
    toaster,
    state,
    stateParams,
    notificationService,
  ) => {
    scope.init = () => {
      scope.getList();
    };
    scope.isEdit = () => {
      return (stateParams.id) ? true : false;
    };
    scope.getNewsFeed = function (id) {
      if (stateParams.id) {
        httpService.getData('/api/newsfeed/' + stateParams.id)
          .success(function (response, status, headers, config) {
            scope.newsFeedTitle = response.data.title;
            scope.newsFeedDescription = response.data.description;
            scope.ImageSrcOld = response.data.image;
            scope.ImageSrc = scope.ImageSrcOld;
          })
          .error(function (error, status, headers, config) {
            notificationService.error('Unable to connect with the server while get the news feeds informations.');
          });
      }
    };
    scope.getList = function () {
      httpService.postData('/api/newsfeeds', {
        limit: 100000,
        skip: 0
      })
        .success(function (response, status, headers, config) {
          scope.newsFeeds = response.data;
        })
        .error(function (error, status, headers, config) {
          notificationService.error('Unable to connect with the server while get the news feeds informations.');
        });
    };
    scope.disableSave = false;
    // upload later on form submit or something similar
    scope.addNewsFeeds = () => {
      if (stateParams.id) {
        // edit

        if (scope.ImageSrcOld === scope.ImageSrc) {
          // no new image upload
          const data = {
            title: scope.formData.title.$viewValue,
            description: scope.formData.description.$viewValue,
            id: stateParams.id,
            editFile: false
          };
          scope.upload(data, '/api/editnewsfeed');
        } else {
          const data = {
            title: scope.formData.title.$viewValue,
            description: scope.formData.description.$viewValue,
            image: scope.formData.file.$viewValue,
            id: stateParams.id,
            editFile: true
          };

          scope.upload(data, '/api/editnewsfeed');
        }
      } else {
        // add new
        console.log('scope.formData.file.$viewValue', scope.formData.file.$viewValue);
        if (scope.formData.$valid) {
          const data = {
            title: scope.formData.title.$viewValue,
            description: scope.formData.description.$viewValue,
            image: scope.formData.file.$viewValue
          };
          scope.upload(data, '/api/newsfeed');
        } else {
          notificationService.error('All fields required.');
        }
      }
    };

    // upload on file select or drop
    scope.upload = function (data, url) {
      scope.disableSave = true;
      Upload.upload({
        url: url,
        data: data
      }).then((resp) => {
        notificationService.success('News feed saved sucessfully.');
        state.go('admin.news-feeds');
        scope.disableSave = false;
        // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
      }, (resp) => {
        notificationService.error('Unable to add new news feed. Please try again.');
        scope.disableSave = false;
      }, (evt) => {

      });
    };

    scope.deleteNewsFeed = function (news) {
      if (confirm('Are you sure!')) {
        // call delete api and refresh page list
        ///api/newsfeeds/:id
        httpService.deleteData(`/api/newsfeeds/${news.id}`)
          .success((response) => {
            notificationService.success('News has been deleted.');
            scope.getList();
          })
          .error((error) => {
            notificationService.error('Something went wrong');
          });
        scope.getList();
      }
    };

    // scope.allSliderImages = [];
    // scope.getSliderImages = () => {
    //   httpService.getData('/api/sliderimages')
    //     .success((response, status, headers, config) => {
    //       if (response.result) {
    //         scope.allSliderImages = response.data;
    //       }
    //     })
    //     .error(function (error, status, headers, config) {
    //       console.log('error', error);
    //     });
    // };
    // scope.getSliderImages();
    // scope.removeImage = (image) => {
    //   httpService
    //     .deleteData(`/api/sliderimage/${image.id}`)
    //     .success((response, status, headers, config) => {
    //       if (response.result) {
    //         toaster.success({
    //           body: 'text1',
    //           title: 'Removed Successfully'
    //         });
    //         const filteredArray = _.filter(scope.allSliderImages, (o) => o.id !== image.id);
    //         scope.allSliderImages = filteredArray;
    //       }
    //     })
    //     .error(function (error, status, headers, config) {
    //       console.log('error', error);
    //     });
    // };

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
