const express = require('express');
const cors = require('cors');
const demoRoutes = require('./routes/demoRoutes');
const sprintRoutes = require('./routes/sprintRoutes');
const authRoutes = require('./routes/authRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// 1. Enable CORS so frontend applications can invoke the backend APIs
app.use(cors({
  origin: '*', // For development/demo purposes. Adjust this for production.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Enable JSON body parsing
app.use(express.json());

// 3. Enable urlencoded body parsing (e.g. form submissions)
app.use(express.urlencoded({ extended: true }));

// 4. Attach API routes under the /api path prefix
app.use('/api', demoRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/auth', authRoutes);

// 5. Register Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
