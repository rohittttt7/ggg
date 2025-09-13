import express from 'express';
import { mockServices } from '../services/mockService.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get current user profile (mock for now)
router.get('/profile', auth, async (req, res) => {
  try {
    // If auth middleware attached a user, return it
    if (req.user) {
      return res.json(req.user);
    }

    // Fallback for demo (should rarely hit)
    const demo = await mockServices.findUser({ email: 'demo@rewear.com' });
    const { password, ...rest } = demo || {};
    res.json(rest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;