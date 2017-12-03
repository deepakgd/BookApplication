angular.module('MyApp')
  .controller('GoogleCtrl', function($scope, $routeParams, $timeout ,Book) {

    $scope.search = function(){
    	Book.getBookByTitle({ title: $scope.title }).then(function(response){
    		$scope.books = response.data;
    	}).catch(function(error){
    		console.log(error)
    	})
    }

  });
