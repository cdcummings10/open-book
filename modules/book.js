'use strict';

module.exports = Book;

/**
 * Constructor
 */

function Book(rawBook) {
  // Get raw data ready

  // Only first author kept
  let author = rawBook.volumeInfo.authors && rawBook.volumeInfo.authors[0];
  author = author ? author : null;

  let description = rawBook.volumeInfo.description;
  description = description ? description : null;

  let thumbnail = rawBook.volumeInfo.imageLinks && rawBook.volumeInfo.imageLinks.thumbnail && rawBook.volumeInfo.imageLinks.thumbnail.replace('http', 'https');
  thumbnail = thumbnail ? thumbnail : null;

  let title = rawBook.volumeInfo.title;
  title = title ? title : null;

  // Define constructor properties
  this.author = author;
  this.description = description;
  this.imageLink = thumbnail;
  this.title = title;
}
