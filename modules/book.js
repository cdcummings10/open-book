'use strict';

module.exports = Book;

/**
 * Constructor
 */

function Book(rawBook) {
  this.authors = rawBook.volumeInfo.authors || null;
  this.description = rawBook.volumeInfo.description || null;
  this.title = rawBook.volumeInfo.title || null;
}
