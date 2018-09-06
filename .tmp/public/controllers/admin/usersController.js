'use strict';
app
  .controller('usersCtrl', [
    '$scope',
    'httpService',
    'notificationService',
    '$state',
    '$rootScope',
    (scope, httpService, notificationService, $state, $rootScope) => {

      var lang = {
        'en': {
          UNABLE_GET_INFO: 'Unable to get the user informations',
          // ADMIN_ADD_MSG: 'Admin added sucessfully.',
          // ALL_FIELD_REQ: 'All fields required.',
          // ADMIN_REMOVE_MSG: 'Admin removed sucessfully.',
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
          SEARCH: 'Search'
        },
        'ch': {
          UNABLE_GET_INFO: '无法获取用户信息',
          // ADMIN_ADD_MSG: '管理员添加成功',
          // ALL_FIELD_REQ: '必填所有栏位',
          // ADMIN_REMOVE_MSG: '管理员成功移除了',
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
          SEARCH: '搜索'
        }
      };

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
            console.log('------users------', response);
            if (response.result) {
              scope.allUsers = response.data;
              scope.allProviderUsers = _.filter(scope.allUsers, (o) => o.isProvider === true);
              scope.allSeekerUsers = _.filter(scope.allUsers, (o) => o.isProvider !== true);
              scope.setDatatable('provider');
            } else {
              scope.allUsers = [];
            }
          })
          .error((error, status, headers, config) => {
            notificationService.error(lang[scope.selectedLang].UNABLE_GET_INFO);
          });
      };
      scope.getAllUsersList();
      scope.setDatatable = (type) => {
        setTimeout(() => {
          // $(document).ready(function () {
          // $(`#${type}Table`).dataTable().fnDestroy();
          $(`#${type}Table`).dataTable({
            'pagingType': 'full_numbers',
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
          // });
        }, 0);
      };
      scope.showDetails = (user) => {
        $rootScope.userData = user;
        $state.go('admin.users-details', {
          id: user.id
        });
      };

      scope.$watch(function (scope) { return scope.selectedLang; },
        function (newValue, oldValue) {
          scope.setDatatable((scope.tab === 1 ? 'provider' : 'seeker'));
        }
      );

    }
  ]);
