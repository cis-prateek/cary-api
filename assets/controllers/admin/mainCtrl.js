'use strict';
app.controller('mainCtrl', function ($scope, httpService, $location, Auth, Upload, notificationService) {
  $scope.logout = function () {
    httpService.postData('/api/admin/logout')
      .success(function (response, status, headers, config) {
        Auth.logout();
        $location.path('/login');
      })
      .error(function (error, status, headers, config) {
      });
  };
  // // upload later on form submit or something similar
  // $scope.uploadSliderImages = function () {
  //   const data = {
  //     title: $scope.formData.title,
  //     description: $scope.formData.description,
  //     images: $scope.files
  //   };
  //   $scope.upload(data);
  // };

  // // upload on file select or drop
  // $scope.upload = function (data) {
  //   Upload.upload({
  //     url: '/api/sliderimages',
  //     data: data
  //   }).then(function (resp) {
  //     // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
  //   }, function (resp) {
  //     console.log('Error status: ' + resp.status);
  //   }, function (evt) {
  //     // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
  //     // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
  //   });
  // };

  $scope.getAllCounts = () => {
    httpService.getData('/api/counts')
      .success((response, status, headers, config) => {
        if (response.result) {
          $scope.info = response.data;
          $scope.info = Object.assign($scope.info, {
            totalUsers: (
              Number($scope.info.providers) + Number($scope.info.seekers)
            )
          });
        }
      })
      .error(function (error, status, headers, config) {
        notificationService.error('Unable to connect with the server while get the dashboard informations.');
      });
  };
  $scope.getAllCounts();
});
