'use strict';

/**
 * Dependencies
 */

// Get remote NPM packages
require('dotenv').config();
const express = require('express');

//Database Calls
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));
const methodOverride = require('method-override');

// Get local packages
const DB = require('./modules/db');
const api = require('./modules/api');

// Set packages
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

const db = new DB(client);

/**
 * Globals
 */

let currentSearch = [];

/**
 * Middleware
 */

app.use(methodOverride ((request, response) => {
  if(request.body && typeof request.body === 'object' && '_method' in request.body){
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))

/**
 * Routes
 */

app.get('/', (req, res) => {
  // 1. Get books from database.
  // 2. Render books to page.

  db.readDBBooks()
    .then(sqlResults => {
      //TODO: once front page is finished, EJS to front.
      res.render('pages/index', { storedBooks: sqlResults.rows });
    })
    .catch(err => console.error(err));
});

app.get('/error', (req, res) => {
  res.render('pages/error');
});

app.get('/books/:books_id', (req, res)=> {
  // Shows detailed view of clicked book

  // Unpack clien data
  const id = req.params.books_id;

  // Query database
  Promise.all([
    db.readDBBooksById(id),
    db.readDBBooksForBookshelves()
  ])
    .then(sqlResults => {
      res.render('pages/books/detailFullView', {
        item: sqlResults[0].rows[0],
        bookshelves: sqlResults[1].rows
      });
    })
    .catch(err => console.error(err));
});

app.put('/books/:books_id/update', (req, res) => {
  // Unpack client data for server
  const id = req.path.split('/')[2];
  const {title, author, summary, isbn, bookshelf} = req.body;

  // Pack server data for db
  const clientBook = {
    id: id,
    title: title,
    author: author,
    summary: summary,
    isbn: isbn,
    bookshelf: bookshelf
  }

  // Update database
  db.updateDBBooksByBook(clientBook)
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.error(err));
});

app.delete('/books/:books_id/delete', (req, res) => {
  // Unpack cliend data
  const id = req.path.split('/')[2];

  // Delete from database
  db.deleteDBBooksById(id)
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.error(err));
});

app.get('/searches', (req, res) => {
  // Render book searches page
  res.render('pages/searches/new');
});

app.post('/searches', (req, res) => {
  // Unpack client query string data
  const search = req.body.search[0].split(' ').join('+');
  const field = req.body.search[1];
  const queryString = {
    search: search,
    field: field
  };

  // Get raw data from API
  api.readAPI(queryString)
    .then(books => {
      // Pack server data
      const clientBooks = books.map((book, i) => {
        return {
          author: book.author,
          image: book.imageLink,
          summary: book.description,
          title: book.title,
          id: i
        };
      });
      currentSearch = clientBooks;
      // Render data to client
      res.render('pages/searches/show', { searchResults: clientBooks });
    })
    .catch(err => console.error(err));
});

app.get('/searches/:search_id', (req, res) => {
  res.render('pages/books/detailSearch', { item: currentSearch[req.params.search_id] });
})

app.put('/update/:search_id', (req, res) => {
  // Unpack client data for server
  let {author, title, isbn, image_url, summary, bookshelf} = req.body;
  image_url = currentSearch[req.params.search_id].image;

  // Pack server data for database
  const book = {
    author: author,
    title: title,
    isbn: isbn,
    image_url: image_url,
    summary: summary,
    bookshelf: bookshelf
  };

  db.createDBBooksByBook(book)
    .then(() => {
      res.redirect('/')
    })
    .catch(err => console.error(err));
})

/**
 * Port
 */

client.connect(() =>{
  app.listen(PORT, () => console.log(`listening on ${PORT}`));
});
