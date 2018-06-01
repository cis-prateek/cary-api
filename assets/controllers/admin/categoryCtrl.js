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
                subCat['isActive'] = !!subCat['isActive'] || false;  // @TODO remove that code when all sub-category have the isActive key
                scope.allSubCategoriesWithCat.push(subCat);
              });
            });
          } else {
            scope.allCategoriesWithTags = [];
          }
        })
        .error((error, status, headers, config) => {
          notificationService.error('Unable to connect with the server while get the categories informations.');
        });
    };
    scope.getAllCategoriesWithTags();

    scope.isEdit = () => {
      return (stateParams.id) ? true : false;
    };

    if (state.current.name === 'admin.category-add') {
      scope.saveCategory = () => {
        const data = {
          title: scope.formData.title,
          parentId: scope.formData.parentId,
          image: scope.image
        };
        scope.upload(data);
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
            notificationService.success('Added successfully');
            state.go('admin.category');
          }
        }, (resp) => {
          console.log('Error status: ' + resp.status);
          notificationService.error('Something went wrong');
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
            parentId: category.parentId,
            image: category.image.url
          };
          // for subCategory
          scope.isSubCategory = (category.parentId) ? true : false;
          // for image
          scope.ImageSrc = category.image.url;

        }).error((error) => {
          notificationService.error('Unable to connect with the server while get the category informations.');
          console.log('error------', error);
        });
      };

      scope.getCategoryById(stateParams.id);
      // edit code
      scope.saveCategory = () => {
        const data = {
          title: scope.formData.title,
          parentId: scope.formData.parentId,
          image: scope.image
        };
        scope.editCategory(data);
      };

      scope.editCategory = (data) => {
        httpService.putData(`/api/category/${stateParams.id}`, data)
          .success((response) => {
            state.go('admin.category');
            notificationService.success(response.message);
          })
          .error((error) => {
            notificationService.error(response.message);
          });
      };

    } else {
      scope.changeActiveStatus = (data) => {
        httpService.putData(`/api/category/${data.id}`, {
          isActive: data.isActive
        })
          .success((response, status, headers, config) => {
            notificationService.success(response.message);
          })
          .error((error, status, headers, config) => {
            notificationService.error(response.message);
          });
      };
    }
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
