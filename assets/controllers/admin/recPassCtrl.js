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

    var lang = {
      'en': {
        INVALID_URL: 'Invalid Url.',
        ERROR: 'Something went wrong',
        INVALID_PASSWORD: 'Invalid Password and Confirm Password',
        PASSWORD_CHANGED: 'Password has been changed, you can login now.'
      },
      'ch': {
        INVALID_URL: '无效的网址。',
        ERROR: '出了些问题',
        INVALID_PASSWORD: '密码无效并确认密码',
        PASSWORD_CHANGED: '密码已被更改，您现在可以登录。'
      }
    };

    $scope.checkCodeIsValid = () => {
      // check code from server
      httpService.postData('/api/checkcodeforgotpassword', {
        'code': stateParams.code
      })
        .success(function (response, status, headers, config) {
          if (response.result === 0) {
            notificationService.error(lang[scope.selectedLang].INVALID_URL);
            $state.go('login');
          }
        })
        .error(function (error, status, headers, config) {
          notificationService.error(lang[scope.selectedLang].INVALID_URL);
          $state.go('login');
        });
    };

    $scope.changePassword = () => {
      if ($scope.password === '' || $scope.password !== $scope.confirmPassword) {
        notificationService.error(lang[scope.selectedLang].INVALID_PASSWORD);
      } else {
        httpService.postData('/api/updateforgotpassword', {
          'code': stateParams.code,
          'password': $scope.password
        })
          .success(function (response, status, headers, config) {
            if (response.result === 1) {
              notificationService.success(lang[scope.selectedLang].PASSWORD_CHANGED);
              $state.go('login');
            }
          })
          .error(function (error, status, headers, config) {
            notificationService.error(lang[scope.selectedLang].ERROR);
            $state.go('login');
          });
      }

    };
  }]);
