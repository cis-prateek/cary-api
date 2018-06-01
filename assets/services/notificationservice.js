app.factory('notificationService', function (toaster) {
  return {
    success: function (message) {
      return toaster.success({
        title: 'Success',
        body: message
      });
    },
    error: function (message) {
      return toaster.error({
        title: 'Error',
        body: message
      });
    }
  };
});
