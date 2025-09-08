import express from 'express';
import { mockServices } from '../services/mockService.js';

const router = express.Router();

// Get current user profile (mock for now)
router.get('/profile', async (req, res) => {
  try {
    // For demo, return a mock user profile
    const mockUser = {
      _id: '1',
      email: 'demo@rewear.com',
      firstName: 'Demo',
      lastName: 'User',
      points: 150,
      role: 'user',
      joinedDate: new Date()
    };
    
    res.json(mockUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;