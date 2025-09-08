import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { mockServices, useMockDb } from '../services/mockService.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists (mock for now)
    const existingUser = await mockServices.findUser({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // For now, return a mock response for registration
    const mockUser = {
      id: '999',
      email,
      firstName,
      lastName,
      points: 100,
      role: 'user'
    };

    // Generate token
    const token = jwt.sign(
      { userId: mockUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: mockUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user using mock service
    const user = await mockServices.findUser({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await mockServices.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        points: user.points,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;