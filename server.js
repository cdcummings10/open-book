'use strict';

/**
 * Dependencies
 */

// Get remote NPM packages
require('dotenv').config();
const express = require('express');

// Set packages
const app = express();

app.use(express.static('./public'));

// Set locals
const PORT = process.env.PORT || 3001;

/**
 * Routes
 */
app.set('view engine', 'ejs');

//These 2 app.get render index and link the error page 
app.get('/index', (req, res) => {
  res.render('pages/index');
});

app.get('/error', (req, res) => {
  res.render('pages/error');
});

/**
 * Port
 */

app.listen(PORT, () => console.log(`listening on ${PORT}`));
