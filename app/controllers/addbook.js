angular.module('MyApp')
  .controller('AddBookCtrl', function($scope, $routeParams, $timeout, $location ,Book, Upload) {

  	var page = 1;

  	$scope.init = function(){
  		$scope.book = {
	  		pages: [{
	  			no: "Page 1",
	  			content: ""
	  		}]
	  	};
  	}

  	$scope.addPage = function(){
  		page = page + 1;
  		$scope.book.pages.push({no: "Page "+page,content: ""})
  	}
    
  	$scope.save = function(){
  		Book.createBook($scope.book).then(function(result){
  			$scope.init();
  		}).catch(function(error){
  			console.log(error)
        alert("Unable to create book. Please try again")
  		})
  	}

  	$scope.init();

    $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: 'http://localhost:3000/upload',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    $scope.book.imageUrl = response.data.filepath;
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }   
    }

  });
