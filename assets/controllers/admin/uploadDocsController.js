app.controller('uploadDocsController', [
  '$scope',
  '$state',
  '$rootScope',
  '$localStorage',
  'Upload',
  '$window',
  '$http',
  'notificationService',
  'httpService', function (
    $scope,
    $state,
    $rootScope,
    $localStorage,
    Upload,
    $window,
    $http,
    notificationService,
    httpService) {
    $scope.type = 'none';
    $scope.platformAgreement = function () { //function to call on form submit
      if ($scope.agreement.agreementFile.$valid && $scope.agreementFile) {
        $scope.type = 'agreement';
        $scope.upload($scope.agreementFile);
      }
    };

    $scope.getFileNameAgreement = function () {
      // for agreement
      $http({
        url: '/api/getfilename/agreement',
        method: 'GET'
      }).success(function (data, status, headers, config) {
        console.log('----data----', data);
        $scope.getNameAgreement = data.result;
        // return data.result;
      });

      $http({
        url: '/api/getfilename/service',
        method: 'GET'
      }).success(function (data, status, headers, config) {
        console.log('----data----', data);
        $scope.getNameService = data.result;
        // return data.result;
      });
    };

    $scope.serviceAgreement = function () { //function to call on form submit
      if ($scope.service.serviceFile.$valid && $scope.serviceFile) {
        $scope.type = 'service';
        $scope.upload($scope.serviceFile);
      }
    };
    $scope.upload = function (file) {
      Upload.upload({
        url: '/api/upload-policy-agreement/' + $scope.type, //webAPI exposed to upload the file
        data: {
          file: file
        }
        // headers: { 'Authorization': 'JWT ' + $localStorage.loginUser } //pass file as data, should be user ng-model
      }).then(function (resp) { //upload function returns a promise
        $scope.progress = '';
        $scope.agreementFile = '';
        $scope.serviceFile = '';
        if (resp.data.result === 1) { //validate success
          // $window.alert(resp.data.message);
          notificationService.success(resp.data.message);
        } else {
          notificationService.error('an error occured');
          // $window.alert('an error occured');
        }
      }, function (resp) { //catch error
        notificationService.error('Error occured');
        // $window.alert('Error status: ' + resp.status);
      }, function (evt) {
        console.log(evt);
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        $scope.getFileNameAgreement();
      });
    };

    $scope.download = function (fileName) {
      const fileType = fileName.split('.')[1];
      $http({
        url: '/api/download-agreement/' + fileName,
        method: 'GET',
        responseType: 'arraybuffer'
      }).success(function (data, status, headers, config) {
        var file = new Blob([data], {
          type: `application/${fileType}`
        });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }).error(function (data, status, headers, config) {
        notificationService.error('Unable to download the file');
        // console.log('Unable to download the file');
      });
    };
  }
]);
