'use strict';

module.exports = DB;

/**
 * Constructor
 */

function DB(pgClient) {
  this.pgClient = pgClient;
}

/**
 * Prototypes
 */

// Create

DB.prototype.createDBBooksByBook = function(book) {
  const sql = 'INSERT INTO books(author, title, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6);';
  const qValues = [book.author, book.title, book.isbn, book.image_url, book.summary, book.bookshelf];
  return this.pgClient.query(sql, qValues)
}

// Read

DB.prototype.readDBBooks = function() {
  const sql = 'SELECT * FROM books;'
  return this.pgClient.query(sql);
};

DB.prototype.readDBBooksById = function(id) {
  let sql = 'SELECT * FROM books WHERE id=$1;';
  let qValues = [id];
  return this.pgClient.query(sql, qValues);
};

// Update

DB.prototype.updateDBBooksByBook = function(book) {
  const sql = 'UPDATE books SET author=$1, title=$2, isbn=$3, description=$4, bookshelf=$5 WHERE id=$6;';
  const qValues = [book.author, book.title, book.isbn, book.summary, book.bookshelf, book.id];
  return this.pgClient.query(sql, qValues);
};

// Delete

DB.prototype.deleteDBBooksById = function(id) {
  const sql = 'DELETE FROM books WHERE id=$1;';
  const qValues = [id];
  return this.pgClient.query(sql, qValues);
};
