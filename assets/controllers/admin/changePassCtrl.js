'use strict';
app
  .controller('changePassCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'httpService', 'Auth', 'notificationService', '$localStorage', (
    $scope,
    $state,
    stateParams,
    $rootScope,
    httpService,
    Auth,
    notificationService,
    $localStorage,
  ) => {
    // // console.log('$rootScope----', JSON.parse($rootScope.user).email);
    console.log('------', $localStorage.user);

    var lang = {
      'en': {
        PROFILE_UPDATED: 'Profile has been updated.',
        PASSWORD_UPDATED: 'Password has been changed.',
        ERROR: 'Something went wrong',
        INVALID_PASSWORD: 'Invalid Password and Confirm Password'
      },
      'ch': {
        PROFILE_UPDATED: '个人资料已更新。',
        ADD_SUCCESS: '成功添加',
        ERROR: '出了些问题',
        PASSWORD_UPDATED: '密码已被更改。',
        INVALID_PASSWORD: '密码无效并确认密码'
      }
    };

    $scope.adminEmail = JSON.parse($localStorage.user).email;
    $scope.name = JSON.parse($localStorage.user).name;
    $scope.phonenumber = JSON.parse($localStorage.user).phonenumber;

    $scope.changeProfile = () => {
      httpService.postData('/api/adminUserProfile', {
        'name': $scope.name,
        'phonenumber': $scope.phonenumber,
        'email': $scope.adminEmail
      })
        .success(function (response, status, headers, config) {
          if (response.result === 1) {
            notificationService.success(lang[scope.selectedLang].PROFILE_UPDATED);
            Auth.setUser(response.data[0]);
            $state.go('admin');
          }
        })
        .error(function (error, status, headers, config) {
          notificationService.error(lang[scope.selectedLang].ERROR);
        });
    };

    $scope.changePassword = () => {
      if ($scope.password === '' || $scope.password !== $scope.confirmPassword) {
        notificationService.error(lang[scope.selectedLang].INVALID_PASSWORD);
      } else {
        httpService.postData('/api/updatepassword', {
          'password': $scope.password
        })
          .success(function (response, status, headers, config) {
            if (response.result === 1) {
              notificationService.success(lang[scope.selectedLang].PASSWORD_UPDATED);
              $state.go('admin');
            }
          })
          .error(function (error, status, headers, config) {
            notificationService.error(lang[scope.selectedLang].ERROR);
          });
      }

    };
  }]);
