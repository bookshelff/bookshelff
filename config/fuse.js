const Fuse = require('fuse.js');
const Book = require('../models/book');

const books = Book.find({});

const fuse = new Fuse(books,{
    keys: [
        'title',
        'author',
        'type'
    ]
});

module.exports = fuse;