angular.module('app').factory('httpService', function ($http) {
  return {
    getData: function (url) {
      return $http({
        method: 'GET',
        url: url,
        withCredentials: true
      });
    },
    postData: function (url, data) {
      return $http({
        method: 'POST',
        url: url,
        data: data,
        withCredentials: true
      });
    },
    putData: function (url, data) {
      return $http({
        method: 'PUT',
        url: url,
        data: data,
        withCredentials: true
      });
    },
    deleteData: (url, info) => {
      return $http({
        method: 'DELETE',
        url: url,
        data: info,
        withCredentials: true
      });
    }
  };
});
