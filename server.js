'use strict';

/**
 * Dependencies
 */

// Get remote NPM packages
require('dotenv').config();
const express = require('express');

// Get local packages
const Book = require('./modules/book');
const api = require('./modules/api');

// Set packages
const app = express();

app.use(express.static('./public'));

// Set locals
const PORT = process.env.PORT || 3001;

/**
 * Routes
 */
app.set('view engine', 'ejs');

app.get('/hello', (req, res) => {
  res.send('Hello world');
});

/**
 * Port
 */

app.listen(PORT, () => console.log(`listening on ${PORT}`));
