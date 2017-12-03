angular.module('MyApp')
  .controller('BookCtrl', function($scope, $routeParams, $timeout ,Book) {
    $scope.id = $routeParams.id;
    $scope.isEnabled = false;

    $scope.init = function(){
        console.log("gety data")
    	Book.getBookById($scope.id).then(function(response){
    		$scope.book = response.data;
            $scope.isEnabled = true;
            $timeout(function(){$('#mybook').booklet()},100)
    	}).catch(function(error){
    		console.log(error)
            alert("Unable to get book details. Please try again")
    	})
    }

    $scope.init()
  });
