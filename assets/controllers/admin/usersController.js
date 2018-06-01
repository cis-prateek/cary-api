'use strict';
app
  .controller('usersCtrl', [
    '$scope',
    'httpService',
    'notificationService',
    '$state',
    '$rootScope',
    (scope, httpService, notificationService,$state,$rootScope) => {

      scope.tab = 1;
      scope.setTab = (tabId) => {
        scope.tab = tabId;
        scope.setDatatable((tabId === 1 ? 'provider' : 'seeker'));
      };

      scope.isSet = (tabId) => {
        return scope.tab === tabId;
      };

      scope.allUsers = [];
      scope.getAllUsersList = function () {
        httpService.getData('/api/users')
          .success((response, status, headers, config) => {
            if (response.result) {
              scope.allUsers = [];
              scope.allProviderUsers = _.filter(scope.allUsers, (o) => o.isProvider === true);
              scope.allSeekerUsers = _.filter(scope.allUsers, (o) => o.isProvider !== true);
              scope.setDatatable('provider');
            } else {
              scope.allUsers = [];
            }
          })
          .error((error, status, headers, config) => {
            notificationService.error('Unable to get the user informations');
          });
      };
      scope.getAllUsersList();
      scope.setDatatable = (type) => {
        setTimeout(() => {
          $(document).ready(function () {
            scope.activeTable = $(`#${type}Table`).dataTable({
              'pagingType': 'full_numbers',
              'destroy': true
            });
          });
        }, 0);
      };
      scope.showDetails = (user) => {
        $rootScope.userData = user;
        $state.go('admin.users-details', {
          id: user.id
        });
      };

    }
  ]);
