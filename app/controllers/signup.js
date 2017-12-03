angular.module('MyApp')
  .controller('SignupCtrl', function($scope, $rootScope, $location, $window, $auth) {
       console.log("######################")
       console.log("######################")
       console.log("######################")
       console.log("######################")
   
    $scope.signup = function() {

      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          console.log(response)
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };
       console.log("######################")

    $scope.authenticate = function(provider) {
       console.log("######################")
       console.log(provider)
      $auth.authenticate(provider)
        .then(function(response) {
          console.log("inside")
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  });