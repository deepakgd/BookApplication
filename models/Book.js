var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isbn: { type: String, unique: true, required: true},
  author: String,
  description: String,
  category: String,
  pages: [
    {
      no: String,
      content: String,
    }
  ],
  imageUrl: String,
}, schemaOptions);


var Book = mongoose.model('Book', bookSchema);

module.exports = Book;
