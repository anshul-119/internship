// Load environmental variables from .env file first
require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// 1. Establish database connection
connectDB();

// 2. Start the HTTP server
const server = app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  Server is running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`========================================`);
});

// 3. Graceful shutdown on unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Promise Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
