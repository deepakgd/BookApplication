var Book = require('../models/Book');
var User = require('../models/User');
var books = require('google-books-search');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

/**
 * GET /getBooks
 */
exports.getBooks = function(req, res){

	Book.find({}).lean().exec(function(err, books){
		if(err) return res.status(400).send(err);

		if(req.headers.authorization){
			let key = req.headers.authorization.replace("Bearer ", "");

			jwt.verify(key, process.env.TOKEN_SECRET, function(err, decoded) {
			  
			  User.findById(decoded.sub).lean().exec(function(err, user) {
			  	if(err) return res.status(500).send(err);

			  	if(user && user.favorites){
			  		let collections = books.map(function(item){
				  		if(user.favorites.indexOf(item._id.toString()) >=0) return { _id:item._id, title: item.title, imageUrl: item.imageUrl, isbn: item.isbn, description: item.description, isFavorite: true }
				  		else return { _id:item._id, title: item.title, imageUrl: item.imageUrl, isbn: item.isbn, description: item.description, isFavorite: false }
				  	});

				  	// let customizeObject = Object.assign({})

				  	return res.status(200).json(collections);
				  }else return res.status(200).json(books);

			  	
			  })

			});
		}else return res.status(200).send(books);
	})
}


/**
 * POST /getBooksByTitle
 */
exports.getBooksByTitle = function(req, res){
	req.assert('title', 'Title cannot be blank').notEmpty();
	
	var errors = req.validationErrors();

	if(errors) return res.status(400).send(errors);

	books.search(req.body.title, function(error, books) {
	    if (error) return res.status(400).send(error);
	    return res.status(200).send(books);
	});

	// feature work ---> local db search by title
	// Book.find({ title: req.body.title }, function(err, books){
	// 	if(err) return res.status(400).send(err);
	// 	return res.status(200).send(books);
	// })
}


/**
 * POST /getBooksByISBN
 */
exports.getBooksByISBN = function(req, res){
	req.assert('isbn', 'ISBN cannot be blank').notEmpty();
	
	var errors = req.validationErrors();

	if(errors) return res.status(400).send(errors);

	Book.find({ isbn: req.body.isbn }, function(err, books){
		if(err) return res.status(400).send(err);
		return res.status(200).send(books);
	})
}


/**
 * POST /createBook
 */
exports.createBook = function(req, res){
	req.assert('title', 'Title cannot be blank').notEmpty();
	req.assert('isbn', 'ISBN cannot be blank').notEmpty();
	req.assert('imageUrl', 'Please upload file').notEmpty();

	var errors = req.validationErrors();

	if(errors) return res.status(400).send(errors);

	var book = new Book(req.body)
	book.save(function(err){
		if(err) return res.status(500).send(err);
		return res.status(200).send("Book created successfully");
	})
}

/**
 * GET /getBook/:id
 */
exports.getBook = function(req, res) {
  if(!req.params.id) return res.status(400).send("Book Id cannot be blank");

  Book.findById(req.params.id, function(err, book){
  	if(err) return res.status(500).send(err);
  	return res.status(200).json(book);
  })

};


/**
 * DELETE /deleteBook
 */
exports.deleteBook = function(req, res) {
	req.assert('bookId', 'Book Id cannot be blank').notEmpty();

	var errors = req.validationErrors();

	if(errors) return res.status(400).send(errors);

	Book.remove({_id: req.para}, function(err, book){
	   	if(err) return res.status(500).send(err);
		return res.status(200).send(book);
	})
};


/**
 * POST /favoriters
 */
exports.addFavorites = function(req, res){
	req.assert('bookId', 'Book Id cannot be blank').notEmpty();

	var errors = req.validationErrors();

	if(errors) return res.status(400).send(errors);

	if(!req.headers.authorization) return res.status(403).send("UnAuthorized User");
	
	let key = req.headers.authorization.replace("Bearer ", "");

	jwt.verify(key, process.env.TOKEN_SECRET, function(err, decoded) {
	  
	  User.findByIdAndUpdate(decoded.sub, { $push: {"favorites": req.body.bookId}}, {}, function(err, model) {
	  	if(err) return res.status(500).send(err);
	  	return res.status(200).send("Book successfully added");
	  })

	});

}