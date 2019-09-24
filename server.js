'use strict';

/**
 * Dependencies
 */

// Get remote NPM packages
require('dotenv').config();
const express = require('express');

// Get local packages
const api = require('./modules/api');

// Set packages
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

/**
 * Routes
 */

app.get('/', (req, res) => {
  res.render('pages/index');
});

//These 2 app.get render index and link the error page 
app.get('/index', (req, res) => {
  res.render('pages/index');
});

app.get('/error', (req, res) => {
  res.render('pages/error');
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

      console.log(books);

      // Pack server data
      const clientBooks = books.map(book => {
        return {
          author: book.author,
          image: book.imageLink,
          summary: book.description,
          title: book.title
        };
      });

      // Render data to client
      res.render('pages/show', clientBooks);
    })
    .catch(err => console.error(err));
});

/**
 * Port
 */

app.listen(PORT, () => console.log(`listening on ${PORT}`));
