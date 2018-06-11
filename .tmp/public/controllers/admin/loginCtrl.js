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

    var lang = {
      'en': {
        INVALID_CREDENTIAL: 'Invalid Credentials, Please try again.',
        EMAIL_SENT: 'Email sent successfully.'
      },
      'ch': {
        INVALID_CREDENTIAL: '凭证无效，请重试。',
        EMAIL_SENT: '电子邮件发送成功'
      }
    };

    $scope.isError = null;
    $scope.login = () => {
      httpService.postData('/api/admin', $scope.admin)
        .success(function (response, status, headers, config) {
          if (response.data) {
            Auth.setUser(response.data);
            $state.go('admin');
          } else {
            notificationService.error(lang[scope.selectedLang].INVALID_CREDENTIAL);
            // $scope.isError = 'Invalid Credentials, Please try again.';
            localStorage.removeItem('user');
          }
        })
        .error(function (error, status, headers, config) {
          notificationService.error(lang[scope.selectedLang].INVALID_CREDENTIAL);
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
            notificationService.success(lang[scope.selectedLang].EMAIL_SENT);
          } else {
            notificationService.error(lang[scope.selectedLang].INVALID_CREDENTIAL);
          }
          $scope.email = '';
        })
        .error(function (error, status, headers, config) {
          notificationService.error(lang[scope.selectedLang].INVALID_CREDENTIAL);
          $scope.email = '';
        });
    };
    $scope.calcelForgotPassword = () => {
      $state.go('login');
    };
  }]);
