module.exports.routes = {
  '/': {
    view: 'homepage'
  },

  'POST /api/login': 'AuthController.login',
  'POST /api/signup': 'AuthController.signup',
  'POST /api/admin': 'AuthController.adminLogin',
  'POST /api/adminforgotpassword': 'AuthController.adminForgotPassword',
  'POST /api/checkcodeforgotpassword': 'AuthController.checkCodeForgotPassword',
  'POST /api/updateforgotpassword': 'AuthController.updateForgotPassword',
  'POST /api/updatepassword': 'AuthController.updatePassword',

  'GET /api/admin/profile': 'ProfileController.getAdminProfile',
  'GET /api/me': 'AuthController.checkLogin',
  'POST /api/admin/logout': 'AuthController.adminLogout',
  // OTP
  'POST /api/generate-otp': 'OTPController.generateOTP',
  'POST /api/forgotpasswordotp': 'OTPController.generateForgotPasswordOTP',

  // USER APIs
  'GET /api/users': 'UserController.getAllUsers',
  'POST /api/updateProfile': 'ProfileController.updateProfile',
  'GET /api/profile': 'ProfileController.getProfile',
  'GET /api/user/profile/:userId': 'ProfileController.getUserProfileById',
  'POST /api/logout': 'AuthController.logout',
  'POST /api/user/avatar': 'UserController.uploadAvatar',
  'GET /api/user/avatar': 'UserController.getAvatar',
  'POST /api/user/portfolio': 'ProfileController.uploadPortfolio',
  'DELETE /api/user/portfolio': 'ProfileController.removePortfolio',
  'GET /api/user/sub_registration/:userId': 'ProfileController.checkSubRegistration',
  'POST /api/user/saveCatTags': 'UsersCategoriesController.saveUserCategoriesWithTags',
  'GET /api/user/:userId/categorieswithsubcategories': 'UsersCategoriesController.getUserCategoriesWithSubCategories',
  'POST /api/user/changepassword': 'UserController.changePassword',
  'POST /api/forgotpassword': 'AuthController.forgotPassword',

  // Category api.
  'GET /api/category': 'CategoryController.getActiveCategories',
  'POST /api/category': 'CategoryController.addCategory',
  'PUT /api/category/:id': 'CategoryController.updateCategory',
  'GET /api/category/:id': 'CategoryController.getCategoryById',
  'GET /api/categoryWithTags': 'CategoryController.getActiveCategoryWithTags',

  // user vise catgegories & sub-categories
  'GET /api/usercategory': 'CategoryController.getUserActiveCategories',
  'GET /api/user-subcategory/:id': 'CategoryController.getUserActiveSubCategories',

  // Sub-categories APIs
  'GET /api/sub-category/:id': 'CategoryController.getActiveSubCategories',

  // total count
  'GET /api/count/seekers': 'CommonController.getSeekersCount',
  'GET /api/count/providers': 'CommonController.getProvidersCount',
  'GET /api/count/transactions': 'CommonController.getTransactionsCount',
  'GET /api/counts': 'CommonController.getCounts',

  // Top Providers
  'GET /api/provider/:id': 'ProvidersController.getProviderById',
  'GET /api/providers': 'ProvidersController.getAllProviders',
  'GET /api/top-providers': 'ProvidersController.getTopProviders',

  // QA APIs
  'GET /api/questions': 'QAsController.getAllQuestions',
  'POST /api/questions-bulk': 'QAsController.getAllQuestions',
  'POST /api/questions': 'QAsController.saveQuestions',
  'GET /api/questions/:id': 'QAsController.getQuestionById',
  'POST /api/questions-by-selected-category': 'QAsController.getAllQuestionsBySelectedCategories',

  'GET /api/questions-with-own-answers/:id': 'QAsController.getQuestionWithAnswersBySelectedCategories',
  'GET /api/answers/:questionId': 'QAsController.getAnswersByQuestionId',
  'GET /api/questionanswers/:questionBunchId': 'QAsController.getQuestionAnswerByQuestionBunchId',
  'POST /api/answers': 'QAsController.saveAnswer',
  'POST /api/categoryProviders/:categoryId': 'Category.getCategoryProviders',

  // Slider Images
  'POST /api/sliderimages': 'SliderImageController.saveSliderImages',
  'GET /api/sliderimages': 'SliderImageController.getSliderImages',
  'DELETE /api/sliderimage/:id': 'SliderImageController.deleteSliderImage',

  // Product needs
  'POST /api/add-needs': 'ProductNeedController.addNeeds',
  'GET /api/need/:id': 'ProductNeedController.getNeedById',
  'PUT /api/need/:id/edit': 'ProductNeedController.editNeed',

  'POST /api/ownneeds': 'ProductNeedController.getOwnNeeds', // seeker.
  'POST /api/needs': 'ProductNeedController.getNeeds', // provider.
  'GET /api/need-quatations-list/:needId': 'ProductNeedController.getQuatationsBySeeker', // provider.
  'GET /api/qatation-by-provider/:providerId/:needId': 'ProductNeedController.getQatationByProvider',//Seeker

  'GET /api/need/:id/agreement': 'ProductNeedController.getNeedByIdWithAgreement',

  // Product need Comments
  'POST /api/need-comments': 'ProductNeedCommentController.addNeedsComment',
  'GET /api/need-comments/:needId': 'ProductNeedCommentController.getProvidersListWithNeedsCommentsCounts',
  'GET /api/need-comments/:needId/:providerId': 'ProductNeedCommentController.getNeedsCommentByNeedAndProviderId',
  'PUT /api/need-comment/:id/edit': 'ProductNeedCommentController.editNeedsComment',

  // Policy-Agreement
  'POST /api/upload-policy-agreement/:type': 'PolicyAndAgreementController.uploadPolicyOrAgreement',
  'GET /api/download-agreement/:fileName': 'PolicyAndAgreementController.downloadAgreement',
  'GET /api/getfilename/:fileName': 'PolicyAndAgreementController.getNameOfFile',

  // Orders
  'POST /api/orders': 'OrdersController.createDumyOrder',
  'PUT /api/orders': 'OrdersController.saveOrder',
  'PUT /api/duePaymentOrder': 'OrdersController.duePaymentsOrder',

  // 'GET /api/:type/:id/orders': 'OrdersController.getOwnOrdersByUserId',
  'POST /api/:type/:id/orders': 'OrdersController.getOwnOrdersByUserId',
  'GET /api/order/:id': 'OrdersController.getOrder',
  'POST /api/order/:id/orderimage': 'OrdersController.uploadOrderImages',
  'DELETE /api/order/:id/orderimage': 'OrdersController.removeOrderImages',

  // Quatation for need
  'POST /api/quatation': 'QuatationsController.addQuatation',
  'GET /api/quatation/:id': 'QuatationsController.getQuatation',
  'POST /api/quatations/:needId': 'QuatationsController.getQuatationsByNeedId',
  'PUT /api/quatation/:id/edit': 'QuatationsController.editQuatation',
  'POST /api/quatation/:needId/provider': 'QuatationsController.providerListByNeedId',

  // news feed
  'POST /api/newsfeeds': 'NewsFeedController.getNewsFeed',
  'GET /api/newsfeed/:id': 'NewsFeedController.getNewsFeedById',
  'POST /api/newsfeed': 'NewsFeedController.addNewsFeed',
  'POST /api/editnewsfeed': 'NewsFeedController.editNewsFeed',
  'DELETE /api/newsfeeds/:id': 'NewsFeedController.deleteNewsFeed',

  'GET /api/getratting/:providerId': 'NewsFeedController.getRatting',

  // adminUsers
  'GET /api/adminuser': 'AdminUserController.getAllAdminUser',
  'POST /api/adminuser': 'AdminUserController.addAdminUser',
  'POST /api/adminUserProfile': 'AdminUserController.updateAdminUser',
  'DELETE /api/adminuser/:userId': 'AdminUserController.deleteAdminUser'

};
