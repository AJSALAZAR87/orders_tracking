const express = require('express');
const twilio = require('twilio');
const logger = require('./src/utils/logger')
const caseRoutes = require('./src/routes/caseRoutes');
const logRequest = require('./src/middlewares/logRequest');
const dotenv = require('dotenv');

const pool = require('./src/config/database')

dotenv.config();  // Load environment variables

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

// Global request logging
app.use(logRequest);
app.use(express.json());  // To parse JSON bodies
app.use('/api', caseRoutes);  // Use routes defined in caseRoutes

app.listen(port, () => {
  const message = `Server is running on http://localhost:${port}`;
  
  // Using winston's log method with a level and message
  logger.info(message);

  // Also logging to console
  console.log(message);
});