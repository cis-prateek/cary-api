'use strict';
app
  .controller('recoverPasswordControl', ['$scope', '$state', '$stateParams', '$rootScope', 'httpService', 'Auth', 'notificationService', (
    $scope,
    $state,
    stateParams,
    $rootScope,
    httpService,
    Auth,
    notificationService,
  ) => {
    $scope.checkCodeIsValid = () => {
      // check code from server
      httpService.postData('/api/checkcodeforgotpassword', {
        'code': stateParams.code
      })
        .success(function (response, status, headers, config) {
          if (response.result === 0) {
            notificationService.error('Invalid Url.');
            $state.go('login');
          }
        })
        .error(function (error, status, headers, config) {
          notificationService.error('Invalid Url.');
          $state.go('login');
        });
    };

    $scope.changePassword = () => {
      if ($scope.password === '' || $scope.password !== $scope.confirmPassword) {
        notificationService.error('Invalid Password and Confirm Password');
      } else {
        httpService.postData('/api/updateforgotpassword', {
          'code': stateParams.code,
          'password': $scope.password
        })
          .success(function (response, status, headers, config) {
            if (response.result === 1) {
              notificationService.success('Password has been changed, you can login now.');
              $state.go('login');
            }
          })
          .error(function (error, status, headers, config) {
            notificationService.error('Some error occured');
            $state.go('login');
          });
      }

    };
  }]);
