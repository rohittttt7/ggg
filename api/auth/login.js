import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
  async findUser(query) {
    if (query.email) {
      return sampleUsers.find(user => user.email === query.email);
    }
    if (query._id) {
      return sampleUsers.find(user => user._id === query._id.toString());
    }
    return null;
  },
  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await mockServices.findUser({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await mockServices.comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'devsecret',
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}