import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { mockServices } from '../services/mockService.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');

    // Try DB first
    let user = null;
    try {
      user = await User.findById(decoded.userId).select?.('-password') || null;
    } catch (_) {
      // ignore DB errors in mock mode
    }

    // Fallback to mock services if not found
    if (!user) {
      user = await mockServices.findUser({ _id: decoded.userId });
      if (user) {
        // align shape a bit
        const { password, ...rest } = user;
        user = rest;
      }
    }

    if (!user) return res.status(401).json({ message: 'Token is not valid' });

    req.user = user;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authorization failed' });
  }
};