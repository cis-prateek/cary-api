'use strict';
app.controller('categoryCtrl', [
  '$scope',
  '$state',
  'httpService',
  '$location',
  'Auth',
  'Upload',
  '$stateParams',
  'notificationService',
  // 'toaster',
  (scope, state, httpService, location, Auth, Upload, stateParams, notificationService,
    //  toaster
  ) => {

    var lang = {
      'en': {
        UNABLE_TO_CONNECT_SERVER: 'Unable to connect with the server while get the categories informations.',
        ADD_SUCCESS: 'Added successfully',
        ERROR: 'Something went wrong',
        UPDATE_SUCCESS: 'Successfully Updated'
      },
      'ch': {
        UNABLE_TO_CONNECT_SERVER: '无法连接服务器，同时获取类别信息。',
        ADD_SUCCESS: '成功添加',
        ERROR: '出了些问题',
        UPDATE_SUCCESS: '成功更新'
      }
    };

    scope.titleError = false;
    scope.catError = false;
    scope.titleChError = false;
    scope.imageError = false;
    scope.allCategories = [];
    scope.tab = 1;
    if (state.current.name === 'admin.category') {
      scope.setTab = (tabId) => {
        scope.tab = tabId;
      };

      scope.isSet = (tabId) => {
        return scope.tab === tabId;
      };
    }

    scope.allSubCategoriesWithCat = [];

    scope.getAllCategoriesWithTags = function () {
      httpService.getData('/api/categoryWithTags')
        .success((response, status, headers, config) => {
          if (response.result) {
            response.data.forEach((cat) => {
              cat['isActive'] = !!cat['isActive'] || false; // @TODO remove that code when all category have the isActive key
              scope.allCategories.push(cat);
              cat.subCategories.forEach((subCat) => {
                subCat.categoryTitle = cat.title;
                subCat.categoryTitle_ch = cat.title_ch;
                subCat['isActive'] = !!subCat['isActive'] || false;  // @TODO remove that code when all sub-category have the isActive key
                scope.allSubCategoriesWithCat.push(subCat);
              });
            });
          } else {
            scope.allCategoriesWithTags = [];
          }
        })
        .error((error, status, headers, config) => {
          notificationService.error(lang[scope.selectedLang].UNABLE_TO_CONNECT_SERVER);
        });
    };
    scope.getAllCategoriesWithTags();

    scope.isEdit = () => {
      return (stateParams.id) ? true : false;
    };

    if (state.current.name === 'admin.category-add') {
      scope.saveCategory = () => {
        if(scope.imageForm.title.$viewValue && scope.imageForm.title_ch.$viewValue ){
          if((scope.isSubCategory && scope.formData.parentId) || !scope.isSubCategory){
            const data = {
              title: scope.formData.title,
              title_ch: scope.formData.title_ch,
              parentId: scope.formData.parentId,
              image: scope.image
            };
            scope.upload(data);
          } else {
            scope.catError = true;
          }
        }else {
          if(!scope.imageForm.title.$viewValue){
            scope.titleError = true;
          }
          if(!scope.imageForm.title_ch.$viewValue){
            scope.titleChError = true;
          }
          if(!scope.ImageSrc){
            scope.imageError = true;
          }
        }
      };

      // upload on file select or drop
      scope.upload = (data) => {
        Upload.upload({
          type: 'POST',
          url: '/api/category',
          data: data
        }).then((resp) => {
          console.log(resp);
          if (resp.data.result) {
            notificationService.success(lang[scope.selectedLang].ADD_SUCCESS);
            state.go('admin.category');
          }
        }, (resp) => {
          console.log('Error status: ' + resp.status);
          notificationService.error(lang[scope.selectedLang].ERROR);
        }, (evt) => {
          console.log(evt);
        });
      };

    } else if (state.current.name === 'admin.category-edit') {
      // @TODO Code here for edit functionality.

      scope.getCategoryById = (id) => {
        console.log('categoryBy id', id);
        httpService.getData('/api/category/' + id).success((response) => {
          const category = response.data;
          scope.formData = {
            title: category.title,
            title_ch: category.title_ch,
            parentId: category.parentId,
            image: category.image.url
          };
          // for subCategory
          scope.isSubCategory = (category.parentId) ? true : false;
          // for image
          scope.ImageSrc = category.image.url;

        }).error((error) => {
          notificationService.error(lang[scope.selectedLang].UNABLE_TO_CONNECT_SERVER);
          console.log('error------', error);
        });
      };

      scope.getCategoryById(stateParams.id);
      // edit code
      scope.saveCategory = () => {
        if(scope.imageForm.title.$viewValue && scope.imageForm.title_ch.$viewValue){
          if((scope.isSubCategory && scope.formData.parentId) || !scope.isSubCategory){
            const data = {
              title: scope.formData.title,
              title_ch: scope.formData.title_ch,
              parentId: scope.formData.parentId,
              image: scope.image
            };
            scope.editCategory(data);
          }else{
            scope.catError = true;
          }
        }
      };

      scope.editCategory = (data) => {
        httpService.putData(`/api/category/${stateParams.id}`, data)
          .success((response) => {
            state.go('admin.category');
            notificationService.success(lang[scope.selectedLang].UPDATE_SUCCESS);
          })
          .error((error) => {
            notificationService.error(lang[scope.selectedLang].ERROR);
          });
      };

    } else {
      scope.changeActiveStatus = (data) => {
        httpService.putData(`/api/category/${data.id}`, {
          isActive: data.isActive
        })
          .success((response, status, headers, config) => {
            notificationService.success(lang[scope.selectedLang].UPDATE_SUCCESS);
          })
          .error((error, status, headers, config) => {
            notificationService.error(lang[scope.selectedLang].ERROR);
          });
      };
    }

    scope.updateField = function (field){
      switch(field) {
      case 'title':
        scope.titleError = ! scope.imageForm.title.$viewValue.trim();
        break;
      case 'title_ch':
        scope.titleChError = ! scope.imageForm.title_ch.$viewValue.trim();
        break;
      case 'image':
        scope.imageError = !scope.ImageSrc;
        break;
      case 'parent_category':
        scope.catError = ! scope.imageForm.parentId.$viewValue.trim();
        break;
      default:
        break;
      }
    };

  }]);

// ngFileSelect :: for showing image preview before upload
app.directive('ngFileSelect', function () {
  return {
    link: function (scope, el) {
      el.bind('change', function (e) {
        var reader = new FileReader();
        reader.readAsDataURL((e.srcElement || e.target).files[0]);
        reader.onload = function (e) {
          scope.$apply(function () {
            scope.ImageSrc = e.target.result;
          });
        };
      });
    }
  };
});
