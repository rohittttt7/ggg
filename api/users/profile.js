import jwt from 'jsonwebtoken';

// Mock data
const sampleUsers = [
  {
    _id: '1',
    email: 'demo@rewear.com',
    firstName: 'Demo',
    lastName: 'User',
    points: 150,
    role: 'user',
    joinedDate: new Date()
  },
  {
    _id: '2',
    email: 'admin@rewear.com',
    firstName: 'Admin',
    lastName: 'User',
    points: 200,
    role: 'admin',
    joinedDate: new Date()
  }
];

const mockServices = {
  async findUser(query) {
    if (query._id) {
      return sampleUsers.find(user => user._id === query._id.toString());
    }
    return null;
  }
};

const auth = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');

    const user = await mockServices.findUser({ _id: decoded.userId });
    if (!user) {
      res.status(401).json({ message: 'Token is not valid' });
      return null;
    }

    return user;
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
    return null;
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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Auth required
    const user = await auth(req, res);
    if (!user) return;

    res.json(user);
  } catch (error) {
    console.error('Profile API error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}