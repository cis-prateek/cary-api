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

      var lang = {
        'en': {
          UNABLE_GET_INFO: 'Unable to get the user informations',
          ADMIN_ADD_MSG: 'Admin added sucessfully.',
          ALL_FIELD_REQ: 'All fields required.',
          ADMIN_REMOVE_MSG: 'Admin removed sucessfully.',
          DISPLAY: 'Display',
          RECORDS_PER_PAGE: 'records per page',
          ZERO_RECORDS: 'No records found.',
          SHOWING_PAGE: 'Showing page',
          OF: 'of',
          NO_REC_AVAILABLE: 'No records available',
          FILTERED_FROM: 'filtered from',
          TOTAL_RECORDS: 'total records',
          FIRST: 'First',
          PREVIOUS: 'Previous',
          NEXT: 'Next',
          LAST: 'Last',
          SEARCH: 'Search',
          ERROR: 'Something went wrong'
        },
        'ch': {
          UNABLE_GET_INFO: '无法获取用户信息',
          ADMIN_ADD_MSG: '管理员添加成功',
          ALL_FIELD_REQ: '必填所有栏位',
          ADMIN_REMOVE_MSG: '管理员成功移除了',
          DISPLAY: '显示',
          RECORDS_PER_PAGE: '每页记录',
          ZERO_RECORDS: '找不到记录',
          SHOWING_PAGE: '显示页面',
          OF: '的',
          NO_REC_AVAILABLE: '没有可用的记录',
          FILTERED_FROM: '已过滤',
          TOTAL_RECORDS: '全部记录',
          FIRST: '第一',
          PREVIOUS: '以前',
          NEXT: '下一个',
          LAST: '持续',
          SEARCH: '搜索',
          ERROR: '出了些问题'
        }
      };

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
            notificationService.error(lang[scope.selectedLang].UNABLE_GET_INFO);
          });
      };
      scope.getAllUsersList();

      scope.dataTableInit = function () {
        setTimeout(() => {
          // $('#adminUserTable').dataTable().fnDestroy();
          $('#adminUserTable').dataTable({
            'destroy': true,
            'language': {
              'search': lang[scope.selectedLang].SEARCH,
              'lengthMenu': lang[scope.selectedLang].DISPLAY + ' _MENU_ ' + lang[scope.selectedLang].RECORDS_PER_PAGE,
              'zeroRecords': lang[scope.selectedLang].ZERO_RECORDS,
              'info': lang[scope.selectedLang].SHOWING_PAGE + ' _PAGE_ ' + lang[scope.selectedLang].OF + ' _PAGES_',
              'infoEmpty': lang[scope.selectedLang].NO_REC_AVAILABLE,
              'infoFiltered': '(' + lang[scope.selectedLang].FILTERED_FROM + ' _MAX_ ' + lang[scope.selectedLang].TOTAL_RECORDS + ')',
              'paginate': {
                'first': lang[scope.selectedLang].FIRST,
                'previous': lang[scope.selectedLang].PREVIOUS,
                'next': lang[scope.selectedLang].NEXT,
                'last': lang[scope.selectedLang].LAST
              }
            }
          });
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
                  notificationService.success(lang[scope.selectedLang].ADMIN_ADD_MSG);
                  $state.go('admin.admin-users');
                }
              })
              .error(function (error, status, headers, config) {
                notificationService.error(lang[scope.selectedLang].ERROR);
              });

          } else {
            notificationService.error(lang[scope.selectedLang].ALL_FIELD_REQ);
          }
        }
      };

      scope.removeAdminUser = function (userId) {
        httpService.deleteData(`/api/adminuser/${userId}`)
          .success(function (response, status, headers, config) {
            if (response.result === 1) {
              notificationService.success(lang[scope.selectedLang].ADMIN_REMOVE_MSG);
              // $state.go('admin.admin-users');
              scope.allUsers = [];
              scope.getAllUsersList();
            }
          })
          .error(function (error, status, headers, config) {
            notificationService.error(lang[scope.selectedLang].ERROR);
          });
      };
      scope.$watch(function (scope) { return scope.selectedLang; },
        function (newValue, oldValue) {
          scope.dataTableInit();
        }
      );
    }
  ]);
