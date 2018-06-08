'use strict';
var app = angular
  .module('app', [
    'ui.router',
    'ngStorage',
    'ngCookies',
    'ngFileUpload',
    'ngAnimate',
    'toaster',
    'pascalprecht.translate'
  ])
  .run((httpService, Auth) => {
    httpService.getData('/api/me')
      .success((response, status, headers, config) => {
        if (!response) {
          /(recoverpassword|password-recovery)/.test(window.location.hash) ? '' : Auth.logout();
        }
      })
      .error(function(error, status, headers, config) {
        console.log('error - init', error);
      });
  });
