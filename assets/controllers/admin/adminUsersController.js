'use strict';
app
  .controller('adminUsersController', [
    '$scope',
    'httpService',
    'notificationService',
    '$stateParams',
    '$state',
    '$localStorage',
    (scope, httpService, notificationService, stateParams, $state, $localStorage) => {

      scope.allUsers = [];
      scope.adminEmail = JSON.parse($localStorage.user).email;
      scope.getAllUsersList = function () {
        httpService.getData('/api/adminuser')
          .success((response, status, headers, config) => {
            if (response.result) {
              scope.allUsers = response.data;
              scope.dataTableInit();
            } else {
              scope.allUsers = [];
            }
          })
          .error((error, status, headers, config) => {
            notificationService.error('Unable to get the user informations');
          });
      };
      scope.getAllUsersList();

      scope.dataTableInit = function () {
        setTimeout(() => {
          $('#adminUserTable').dataTable();
        }, 0);
      };

      scope.isRemovable = function (userEmail) {
        return (scope.adminEmail !== userEmail) ? true : false;
      };

      scope.saveAdminUser = function () {
        if (stateParams.id) {
          // edit
        } else {
          // add new
          console.log('scope.formData.email.$viewValue', scope.formData.email);
          if (scope.formData.email != '' && scope.formData.password != '') {
            const data = {
              email: scope.formData.email,
              password: scope.formData.password,
              name: scope.formData.name,
              phonenumber: scope.formData.phonenumber
            };
            httpService.postData('/api/adminuser', data)
              .success(function (response, status, headers, config) {
                if (response.result === 1) {
                  notificationService.success('Admin added sucessfully.');
                  $state.go('admin.admin-users');
                }
              })
              .error(function (error, status, headers, config) {
                notificationService.error(error.message);
              });

          } else {
            notificationService.error('All fields required.');
          }
        }
      };

      scope.removeAdminUser = function (userId) {
        httpService.deleteData(`/api/adminuser/${userId}`)
          .success(function (response, status, headers, config) {
            if (response.result === 1) {
              notificationService.success('Admin removed sucessfully.');
              // $state.go('admin.admin-users');
              scope.allUsers = [];
              scope.getAllUsersList();
            }
          })
          .error(function (error, status, headers, config) {
            notificationService.error(error.message);
          });
      };
    }
  ]);
