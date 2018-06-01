'use strict';
app
  .controller('loginCtrl', ['$scope', '$state', '$rootScope', 'httpService', 'Auth', 'notificationService', (
    $scope,
    $state,
    $rootScope,
    httpService,
    Auth,
    notificationService
  ) => {
    $scope.isError = null;
    $scope.login = () => {
      httpService.postData('/api/admin', $scope.admin)
        .success(function (response, status, headers, config) {
          if (response.data) {
            Auth.setUser(response.data);
            $state.go('admin');
          } else {
            notificationService.error('Invalid Credentials, Please try again.');
            // $scope.isError = 'Invalid Credentials, Please try again.';
            localStorage.removeItem('user');
          }
        })
        .error(function (error, status, headers, config) {
          notificationService.error('Invalid Credentials, Please try again.');
        });
    };

    // // forgot password function
    // $scope.goforgotPassword = () => {
    //   $state.go('password-recovery');
    // };
    $scope.forgotPassword = () => {
      httpService.postData('/api/adminforgotpassword', {
        'email': $scope.email
      })
        .success(function (response, status, headers, config) {
          if (response.result === 1) {
            notificationService.success('Email sent successfully.');
          } else {
            notificationService.error('Invalid Credentials, Please try again.');
          }
          $scope.email = '';
        })
        .error(function (error, status, headers, config) {
          notificationService.error('Invalid Credentials, Please try again.');
          $scope.email = '';
        });
    };
    $scope.calcelForgotPassword = () => {
      $state.go('login');
    };
  }]);
