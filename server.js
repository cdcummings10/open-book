'use strict';

/**
 * Dependencies
 */

// Get remote NPM packages
require('dotenv').config();
const express = require('express');

// Set packages
const app = express();

// Set locals
const PORT = process.env.PORT || 3001;

/**
 * Routes
 */

app.get('/hello', (req, res) => {
  res.send('Hello world');
});

/**
 * Port
 */

app.listen(PORT, () => console.log(`listening on ${PORT}`));
