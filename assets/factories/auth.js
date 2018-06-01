'use strict';

app.factory('Auth', ($rootScope, $cookies, $sessionStorage, $localStorage, $state) => {
  var user;

  return {
    setUser: function (aUser) {
      user = aUser;
      $sessionStorage.user = aUser;
      $rootScope.user = aUser;
      $cookies.put('user', aUser);
      $rootScope.user = aUser;
      $localStorage.user = JSON.stringify(aUser);
    },

    isLoggedIn: function () {
      if ($localStorage.user) {
        $rootScope.user = $localStorage.user;
        $sessionStorage.currentUserSession = $localStorage.user;
      } else {
        $rootScope.user = {
        };
        $sessionStorage.currentUserSession = {
        };

      }

      return ($localStorage.user) ? !! $localStorage.user : false;
    },

    logout: function () {
      $sessionStorage.user = null;
      $rootScope.user = {

      };
      $localStorage.$reset();
      $cookies.put('user', null);
      localStorage.clear();
      $state.go('login');
    }
  };
});
