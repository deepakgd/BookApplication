angular.module('MyApp', ['ngRoute', 'satellizer', 'ngFileUpload'])
  .config(function($routeProvider, $locationProvider, $authProvider) {
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
  })
  .run(function($rootScope, $window) {
    if ($window.localStorage.user) {
      $rootScope.currentUser = JSON.parse($window.localStorage.user);
    }
  });
