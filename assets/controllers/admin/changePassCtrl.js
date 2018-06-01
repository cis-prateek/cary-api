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
            notificationService.success('Profile has been updated.');
            Auth.setUser(response.data[0]);
            $state.go('admin');
          }
        })
        .error(function (error, status, headers, config) {
          notificationService.error('Some error occured');
        });
    };




    $scope.changePassword = () => {
      if ($scope.password === '' || $scope.password !== $scope.confirmPassword) {
        notificationService.error('Invalid Password and Confirm Password');
      } else {
        httpService.postData('/api/updatepassword', {
          'password': $scope.password
        })
          .success(function (response, status, headers, config) {
            if (response.result === 1) {
              notificationService.success('Password has been changed.');
              $state.go('admin');
            }
          })
          .error(function (error, status, headers, config) {
            notificationService.error('Some error occured');
          });
      }

    };
  }]);
