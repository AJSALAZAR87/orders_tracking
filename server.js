const express = require('express');
const twilio = require('twilio');
const dotenv = require('dotenv');
const cors = require('cors');

const logger = require('./src/utils/logger')
const routes = require('./src/routes/routes');
const logRequest = require('./src/middlewares/logRequest');

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

// const allowedOrigin = 'http://localhost:3000';

// // Configure CORS options
// const corsOptions = {
//   origin: (origin, callback) => {
//       if (!origin || origin === allowedOrigin) {
//           callback(null, true); // Allow the request
//       } else {
//           callback(new Error('Not allowed by CORS')); // Block the request
//       }
//   },
// };

// Apply CORS middleware to all routes
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Global request logging
app.use(logRequest);
app.use(express.json());  // To parse JSON bodies
app.use('/api', routes);  // Use routes defined in caseRoutes

app.listen(port, () => {
  const message = `Server is running on http://localhost:${port}`;
  
  // Using winston's log method with a level and message
  logger.info(message);

  console.log(message);
});