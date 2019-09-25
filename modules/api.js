'use strict';

module.exports = {
  readAPI: readAPI
};

/**
 * Dependencies
 */

// Get remote NPM packages
const superagent = require('superagent');

// Get local packages
const Book = require('./book');

/**
 * Exports
 */

function readAPI(queryString) {
  // Set API url
  let url;
  switch (queryString.field) {
  case 'title':
    url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${queryString.search}`;
    break;
  case 'author':
    url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${queryString.search}`;
    break;
  default:
    // 500
    break;
  }

  // Get Google Books API raw data
  return superagent.get(url)
    .then(rawData => {
      // Unpack Google Book API raw data
      const items = rawData.body.items;

      // Normalize Google Book API raw data
      // Take first 10 books
      const books = items.slice(0, 10).map(item => {
        return new Book(item);
      });

      return new Promise(resolve => resolve(books));
    })
    .catch(err => console.error(err));
}
