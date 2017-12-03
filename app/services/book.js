angular.module('MyApp')
  .factory('Book', function($http) {
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
  });