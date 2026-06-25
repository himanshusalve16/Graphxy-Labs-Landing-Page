const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CLAMPBOX_ALLOWED_ORIGINS
  ? process.env.CLAMPBOX_ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'https://graphxylabs.dev'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed for origin: ' + origin), false);
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Main API Router mapping
const apiRouter = require('./routes');
app.use('/api', apiRouter);

const clampboxRouter = require('../clampbox/routes');
app.use('/api/clampbox', clampboxRouter);

// Root Route
app.get('/', (req, res) => {
  res.send('Clampbox Backend is running.');
});

// Root/Health route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// App Listener
app.listen(PORT, () => {
  console.log(`[Express Server] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
