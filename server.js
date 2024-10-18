require('dotenv').config();
const express = require('express');
const { Client } = require('pg');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

// Configura la conexión a PostgreSQL
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});
client.connect()
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