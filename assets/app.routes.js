'use strict';

app
  .config(config)
  .run(checkURLAccess);

function config($stateProvider, $urlRouterProvider, $locationProvider) {
  // $locationProvider.html5Mode({
  //     enabled: true,
  //     requireBase: false
  // });
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: './templates/admin/login.html',
      controller: 'loginCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('password-recovery', {
      url: '/password-recovery',
      templateUrl: './templates/admin/forgotPassword.html',
      controller: 'loginCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('recoverpassword', {
      url: '/recoverpassword/:code',
      templateUrl: './templates/admin/recoverPassword.html',
      controller: 'recoverPasswordControl',
      data: {
        requireLogin: false
      }
    })
    .state('admin', {
      url: '/admin',
      templateUrl: './templates/admin/index.html',
      controller: 'mainCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('admin.change-password', {
      url: '/admin/change-password',
      templateUrl: './templates/admin/profile/profile.html',
      controller: 'changePassCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('admin.users', {
      url: '/users',
      templateUrl: './templates/admin/users/users-list.html',
      controller: 'usersCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('admin.slider-images', {
      url: '/slider-images',
      templateUrl: './templates/admin/slider-images/slider-images.html',
      controller: 'sliderImageCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('admin.add-slider-image', {
      url: '/slider-images/add',
      templateUrl: './templates/admin/slider-images/add-slider-image.html',
      controller: 'sliderImageCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('admin.category', {
      url: '/category',
      templateUrl: './templates/admin/category/category-list.html',
      controller: 'categoryCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('admin.category-add', {
      url: '/category/add',
      templateUrl: './templates/admin/category/category-add.html',
      controller: 'categoryCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('admin.category-edit', {
      url: '/category/:id/edit',
      templateUrl: './templates/admin/category/category-add.html',
      controller: 'categoryCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('admin.agreement-policy', {
      url: '/agreement-policy',
      templateUrl: './templates/admin/agreement-policy/upload-agreement-policy.html',
      controller: 'uploadDocsController',
      data: {
        requireLogin: true
      }
    })
    .state('admin.news-feeds', {
      url: '/news-feeds',
      templateUrl: './templates/admin/news-feeds/news-feeds.html',
      controller: 'newsFeedsController',
      data: {
        requireLogin: true
      }
    })
    .state('admin.add-news-feeds', {
      url: '/add-news-feeds',
      templateUrl: './templates/admin/news-feeds/add-news-feeds.html',
      controller: 'newsFeedsController',
      data: {
        requireLogin: true
      }
    }).state('admin.edit-news-feeds', {
      url: '/edit-news-feed/:id',
      templateUrl: './templates/admin/news-feeds/add-news-feeds.html',
      controller: 'newsFeedsController',
      data: {
        requireLogin: true
      }
    }).state('admin.admin-users', {
      url: '/admin-users',
      templateUrl: './templates/admin/admin-users/admin-list.html',
      controller: 'adminUsersController',
      data: {
        requireLogin: true
      }
    }).state('admin.add-admin-user', {
      url: '/add-admin-user',
      templateUrl: './templates/admin/admin-users/add-admin.html',
      controller: 'adminUsersController',
      data: {
        requireLogin: true
      }
    });

  $urlRouterProvider.otherwise('login');
};

function checkURLAccess(Auth, $rootScope, $location, $localStorage, $state) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    const { requireLogin } = toState.data;
    if (requireLogin && typeof $localStorage.user === 'undefined' && !$localStorage.user) {
      event.preventDefault();
      $state.go('login');
    } else if ($localStorage.user && !requireLogin) {
      event.preventDefault();
      $state.go('admin');
    }
  });
}
