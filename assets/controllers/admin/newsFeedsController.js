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

    var lang = {
      'en': {
        UNABLE_TO_CONNECT: 'Unable to connect with the server while get the news feeds informations.',
        ERROR: 'Something went wrong',
        NEWS_FEED_SAVE: 'News feed saved sucessfully.',
        UNABLE_TO_SAVE_NEWS_FEED: 'Unable to add new news feed. Please try again.',
        NEWS_DELETED: 'News has been deleted.'
      },
      'ch': {
        UNABLE_TO_CONNECT: '无法在获取新闻提要信息时与服务器连接。',
        ERROR: '出了些问题',
        NEWS_FEED_SAVE: '新闻源成功保存。',
        UNABLE_TO_SAVE_NEWS_FEED: '无法添加新的新闻提要。请再试一次。',
        NEWS_DELETED: '新闻已被删除。'
      }
    };

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
            scope.newsFeedTitle_ch = response.data.title_ch;
            scope.newsFeedDescription = response.data.description;
            scope.newsFeedDescription_ch = response.data.description_ch;
            scope.ImageSrcOld = response.data.image;
            scope.ImageSrc = scope.ImageSrcOld;
          })
          .error(function (error, status, headers, config) {
            notificationService.error(lang[scope.selectedLang].UNABLE_TO_CONNECT);
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
          notificationService.error(lang[scope.selectedLang].UNABLE_TO_CONNECT);
        });
    };
    scope.disableSave = false;
    scope.titleError = false;
    scope.titleError_ch = false;
    scope.descError = false;
    scope.descError_ch = false;

    scope.imageError = false;
    // upload later on form submit or something similar
    scope.addNewsFeeds = () => {
      if (stateParams.id && !scope.titleError && !scope.titleError_ch && !scope.descError && !scope.descError_ch && !scope.imageError) {
        // edit

        if (scope.ImageSrcOld === scope.ImageSrc) {
          // no new image upload
          const data = {
            title: scope.formData.title.$viewValue,
            title_ch: scope.formData.title_ch.$viewValue,
            description: scope.formData.description.$viewValue,
            description_ch: scope.formData.description_ch.$viewValue,
            id: stateParams.id,
            editFile: false
          };
          scope.upload(data, '/api/editnewsfeed');
        } else {
          const data = {
            title: scope.formData.title.$viewValue,
            title_ch: scope.formData.title_ch.$viewValue,
            description: scope.formData.description.$viewValue,
            description_ch: scope.formData.description_ch.$viewValue,
            image: scope.formData.file.$viewValue,
            id: stateParams.id,
            editFile: true
          };

          scope.upload(data, '/api/editnewsfeed');
        }
      } else {
        // add new
        console.log('scope.formData.file.$viewValue', scope.formData.file.$viewValue);
        if (scope.formData.$valid && !scope.titleError && !scope.titleError_ch && !scope.descError && !scope.descError_ch && !scope.imageError) {
          const data = {
            title: scope.formData.title.$viewValue,
            title_ch: scope.formData.title_ch.$viewValue,
            description: scope.formData.description.$viewValue,
            description_ch: scope.formData.description_ch.$viewValue,
            image: scope.formData.file.$viewValue
          };
          scope.upload(data, '/api/newsfeed');
        } else {
          if(!scope.formData.title.$viewValue){
            scope.titleError = true;
          }
          if(!scope.formData.description.$viewValue){
            scope.descError = true;
          }
          if(!scope.formData.title_ch.$viewValue){
            scope.titleError_ch = true;
          }
          if(!scope.formData.description_ch.$viewValue){
            scope.descError_ch = true;
          }
          if(!scope.formData.file.$viewValue){
            scope.imageError = true;
          }
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
        notificationService.success(lang[scope.selectedLang].NEWS_FEED_SAVE);
        state.go('admin.news-feeds');
        scope.disableSave = false;
        // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
      }, (resp) => {
        notificationService.error(lang[scope.selectedLang].UNABLE_TO_SAVE_NEWS_FEED);
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
            notificationService.success(lang[scope.selectedLang].NEWS_DELETED);
            scope.getList();
          })
          .error((error) => {
            notificationService.error(lang[scope.selectedLang].ERROR);
          });
        scope.getList();
      }
    };

    scope.updateField = function (field){
      switch(field) {
      case 'title':
        scope.titleError = ! scope.formData.title.$viewValue.trim();
        break;
      case 'title_ch':
        scope.titleError_ch = ! scope.formData.title_ch.$viewValue.trim();
        break;
      case 'desc':
        scope.descError = ! scope.formData.description.$viewValue.trim();
        break;
      case 'desc_ch':
        scope.descError_ch = ! scope.formData.description_ch.$viewValue.trim();
        break;
      case 'img':
        scope.imageError = ! scope.ImageSrc && !scope.formData.file.$viewValue;
        if(!scope.formData.file.$viewValue){
          scope.ImageSrc = '';
        }
        break;
      default:
        break;
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
