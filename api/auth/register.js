import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock data for Vercel deployment
const sampleUsers = [
  {
    _id: '1',
    email: 'demo@rewear.com',
    password: '$2b$12$AecOKaOFDjQ1olchDrZ6bO1eSXJKHoWFsGJrAzDg4ZEBSGWh4EzgW',
    firstName: 'Demo',
    lastName: 'User',
    points: 150,
    role: 'user',
    joinedDate: new Date()
  },
  {
    _id: '2',
    email: 'admin@rewear.com',
    password: '$2b$12$AecOKaOFDjQ1olchDrZ6bO1eSXJKHoWFsGJrAzDg4ZEBSGWh4EzgW',
    firstName: 'Admin',
    lastName: 'User',
    points: 200,
    role: 'admin',
    joinedDate: new Date()
  }
];

const mockServices = {
  async addUser({ email, password, firstName, lastName, role = 'user', points = 100 }) {
    const exists = sampleUsers.find(u => u.email === email);
    if (exists) {
      const err = new Error('User already exists');
      err.code = 'DUPLICATE';
      throw err;
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = {
      _id: (sampleUsers.length + 1).toString(),
      email,
      password: hashed,
      firstName,
      lastName,
      points,
      role,
      joinedDate: new Date()
    };
    sampleUsers.push(user);
    const { password: _p, ...safe } = user;
    return safe;
  }
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    try {
      const user = await mockServices.addUser({ email, password, firstName, lastName });
      
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'devsecret',
        { expiresIn: '7d' }
      );

      res.status(201).json({ token, user });
    } catch (error) {
      if (error.code === 'DUPLICATE') {
        return res.status(400).json({ message: 'User already exists' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}