angular.module('MyApp', ['ngRoute', 'satellizer', 'ngFileUpload'])
  .config(["$routeProvider", "$locationProvider", "$authProvider", function($routeProvider, $locationProvider, $authProvider) {
    loginRequired.$inject = ["$location", "$auth"];
    skipIfAuthenticated.$inject = ["$location", "$auth"];
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/book/:id', {
        templateUrl: 'partials/detail.html',
        controller: 'BookCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/google', {
        templateUrl: 'partials/google.html',
        controller: 'GoogleCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/addbook', {
        templateUrl: 'partials/addbook.html',
        controller: 'AddBookCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/contact', {
        templateUrl: 'partials/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/account', {
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/forgot', {
        templateUrl: 'partials/forgot.html',
        controller: 'ForgotCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/reset/:token', {
        templateUrl: 'partials/reset.html',
        controller: 'ResetCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .otherwise({
        templateUrl: 'partials/404.html'
      });

    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';
    $authProvider.facebook({
      url: '/auth/facebook',
      clientId: '903032076522774',
      redirectUri: 'http://localhost:3000/auth/facebook/callback'
    });
    $authProvider.google({
      url: '/auth/google',
      clientId: '386706600621-gotcd8abo33npef4rlreoknsno4o15ai.apps.googleusercontent.com',
      redirectUri: "http://localhost:3000/auth/google/callback"
    });

    function skipIfAuthenticated($location, $auth) {
      if ($auth.isAuthenticated()) {
        $location.path('/');
      }
    }

    function loginRequired($location, $auth) {
      if (!$auth.isAuthenticated()) {
        $location.path('/login');
      }
    }
  }])
  .run(["$rootScope", "$window", function($rootScope, $window) {
    if ($window.localStorage.user) {
      $rootScope.currentUser = JSON.parse($window.localStorage.user);
    }
  }]);

angular.module('MyApp')
  .controller('AddBookCtrl', ["$scope", "$routeParams", "$timeout", "$location", "Book", "Upload", function($scope, $routeParams, $timeout, $location ,Book, Upload) {

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

  }]);

angular.module('MyApp')
  .controller('BookCtrl', ["$scope", "$routeParams", "$timeout", "Book", function($scope, $routeParams, $timeout ,Book) {
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
  }]);

angular.module('MyApp')
  .controller('ContactCtrl', ["$scope", "Contact", function($scope, Contact) {
    $scope.sendContactForm = function() {
      Contact.send($scope.contact)
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
    };
  }]);

angular.module('MyApp')
  .controller('ForgotCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.forgotPassword = function() {
      Account.forgotPassword($scope.user)
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
    };
  }]);

angular.module('MyApp')
  .controller('GoogleCtrl', ["$scope", "$routeParams", "$timeout", "Book", function($scope, $routeParams, $timeout ,Book) {

    $scope.search = function(){
    	Book.getBookByTitle({ title: $scope.title }).then(function(response){
    		$scope.books = response.data;
    	}).catch(function(error){
    		console.log(error)
    	})
    }

  }]);

angular.module('MyApp')
  .controller('HeaderCtrl', ["$scope", "$location", "$window", "$auth", function($scope, $location, $window, $auth) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
    
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
    
    $scope.logout = function() {
      $auth.logout();
      delete $window.localStorage.user;
      $location.path('/login');
    };
  }]);

angular.module('MyApp')
  .controller('HomeCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "Book", function($scope, $rootScope, $location, $window, $auth, Book) {

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
  }]);
angular.module('MyApp')
  .controller('LoginCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/account');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
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
  }]);
angular.module('MyApp')
  .controller('ProfileCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "Account", function($scope, $rootScope, $location, $window, $auth, Account) {
    $scope.profile = $rootScope.currentUser;

    $scope.updateProfile = function() {
      Account.updateProfile($scope.profile)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.changePassword = function() {
      Account.changePassword($scope.profile)
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
    };

    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $window.scrollTo(0, 0);
          $scope.messages = {
            error: [response.data]
          };
        });
    };
    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };

    $scope.deleteAccount = function() {
      Account.deleteAccount()
        .then(function() {
          $auth.logout();
          delete $window.localStorage.user;
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };
  }]);
angular.module('MyApp')
  .controller('ResetCtrl', ["$scope", "$routeParams", "Account", function($scope, $routeParams, Account) {
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
  }]);

angular.module('MyApp')
  .controller('SignupCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
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
  }]);
angular.module('MyApp')
  .factory('Account', ["$http", function($http) {
    return {
      updateProfile: function(data) {
        return $http.put('/account', data);
      },
      changePassword: function(data) {
        return $http.put('/account', data);
      },
      deleteAccount: function() {
        return $http.delete('/account');
      },
      forgotPassword: function(data) {
        return $http.post('/forgot', data);
      },
      resetPassword: function(data, token) {
        return $http.post('/reset/'+token, data);
      }
    };
  }]);
angular.module('MyApp')
  .factory('Book', ["$http", function($http) {
    return {
      createBook: function(data) {
        return $http.post('/books', data);
      },
      getBooks: function(data) {
        return $http.get('/books');
      },
      getBookById: function(id) {
        return $http.get('/books/'+id);
      },
      getBookByTitle: function(data) {
        return $http.post('/title', data);
      },
      addFavorites: function(id) {
        return $http.post('/favorites', id);
      }
    };
  }]);
angular.module('MyApp')
  .factory('Contact', ["$http", function($http) {
    return {
      send: function(data) {
        return $http.post('/contact', data);
      }
    };
  }]);