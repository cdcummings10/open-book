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
client.connect();
client.on('error', err => console.error(err));
const methodOverride = require('method-override');

// Get local packages
const api = require('./modules/api');

// Set packages
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

let currentSearch = [];

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

  let sql = 'SELECT * FROM books;'
  client.query(sql)
    .then(sqlResults => {
      //TODO: once front page is finished, EJS to front.
      res.render('pages/index', {storedBooks: sqlResults.rows});
    })
    .catch(err => console.log(err))

  // res.render('pages/index');
});

app.get('/error', (req, res) => {
  res.render('pages/error');
});

app.get('/books/:books_id', (req, res)=> {
  //Shows detailed view of clicked book
  //TODO: Waiting on front end to finish detail.ejs
  console.log(req.params)
  let sql = 'SELECT * FROM books WHERE id=$1;';
  let value = [req.params.books_id];
  console.log(value);
  client.query(sql, value)
    .then(sqlResults => {
      console.log(sqlResults.rows);
      return res.render('pages/books/detailFullView', {item: sqlResults.rows[0]});
    })
    .catch(err => console.log(err));
})

app.get('/searches', (req, res) => {
  // Render book searches page
  res.render('pages/searches/new');
});

app.get('/searches', (req, res) => {
  //TODO: test storage of editted book
  let {author, title, isbn, image_url, description, bookshelf} = req.body;
  let sql = 'INSERT INTO tasks(title, description, category, contact, status) VALUES ($1, $2, $3, $4, $5, $6);';
  let values = [author, title, isbn, image_url, description, bookshelf];

  return client.query(sql, values)
    .then(res.redirect('/'))
    .catch(err => console.log(err))
})

app.post('/edit'), (req, res) => {
  console.log(req);
}

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

/**
 * Port
 */

app.listen(PORT, () => console.log(`listening on ${PORT}`));
