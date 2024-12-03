const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // You can use environment variables to configure DB
});

module.exports = pool;