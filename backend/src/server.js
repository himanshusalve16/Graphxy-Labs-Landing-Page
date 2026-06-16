const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Main API Router mapping
const apiRouter = require('./routes');
app.use('/api', apiRouter);

// Root/Health route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// App Listener
app.listen(PORT, () => {
  console.log(`[Express Server] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
