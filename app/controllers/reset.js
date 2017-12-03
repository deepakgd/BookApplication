angular.module('MyApp')
  .controller('ResetCtrl', function($scope, $routeParams, Account) {
    console.log($routeParams.token)
    $scope.resetPassword = function() {
      Account.resetPassword($scope.user, $routeParams.token)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    }
  });
