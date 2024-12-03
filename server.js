require('dotenv').config();
const express = require('express');
const twilio = require('twilio');

const pool = require('./src/config/database')

const app = express();
const port = process.env.PORT || 3000;

pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database successfully!');
  })
  .catch(err => {
    console.error('Connection to PostgreSQL database failed:', err);
  });

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});