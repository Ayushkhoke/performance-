require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const analyticsRoutes = require('./routes/analytics');
const rewardsRoutes = require('./routes/rewards');
const crewsRoutes = require('./routes/crews');

const connectDB = require('./config/db');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://performance-59t6hit0p-spartan253s-projects.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests and explicitly allow known frontend origins.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/rewards', rewardsRoutes);
app.use('/crews', crewsRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
