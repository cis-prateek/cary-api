module.exports.policies = {

  '*': true,

  ProfileController: {
    '*': 'isAuthenticated'
  },

  UserController: {
    '*': 'isAuthenticated'
  },
  QAsController: {
    '*': 'isAuthenticated'
  },
  SliderImageController: {
    saveSliderImages: ['isAdmin', 'isAuthenticated']
  },
  NewsFeedController: {
    '*': 'isAuthenticated',
    addNewsFeed: ['isAdmin', 'isAuthenticated']
  },
  ProductNeedController: {
    '*': 'isAuthenticated'
  },
  OrdersController: {
    '*': 'isAuthenticated'
  }
};
