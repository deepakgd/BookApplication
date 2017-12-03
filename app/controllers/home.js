angular.module('MyApp')
  .controller('HomeCtrl', function($scope, $rootScope, $location, $window, $auth, Book) {

  	$scope.books = [];

    $scope.init = function() {
     	Book.getBooks().then(function(response){
     		$scope.books = response.data;
     	}).catch(function(response) {
          // $scope.messages = response.data;
          console.log(response)
        });
    };

    $scope.init();

    $scope.addFavorites = function(book){
    	Book.addFavorites({bookId: book._id}).then(function(response){
    		console.log(response)
            book.isFavorite = true;
    	}).catch(function(error){
    		console.log(error)
    	})
    }
  });