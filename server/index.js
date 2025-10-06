import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import userRoutes from './routes/users.js';
import swapRoutes from './routes/swaps.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes);

// Global variable to track DB mode
global.useMockDb = false;

// Connect to MongoDB with fallback to mock database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rewear');
    console.log('MongoDB connected successfully');
    global.useMockDb = false;
  } catch (error) {
    console.warn('MongoDB connection failed, using mock database for development:', error.message);
    global.useMockDb = true;
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (global.useMockDb) {
    console.log('Using mock database - Demo data available:');
    console.log('Demo User: demo@rewear.com / password123');
    console.log('Admin User: admin@rewear.com / password123');
  }
});