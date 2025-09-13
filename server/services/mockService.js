// Simple function to get the right model based on environment
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Check if we should use mock database
const useMockDb = () => {
  return !mongoose.connection.readyState || mongoose.connection.readyState !== 1;
};

// Sample data for testing
const sampleUsers = [
  {
    _id: '1',
    email: 'demo@rewear.com',
    password: '$2b$12$AecOKaOFDjQ1olchDrZ6bO1eSXJKHoWFsGJrAzDg4ZEBSGWh4EzgW', // 'password123'
    firstName: 'Demo',
    lastName: 'User',
    points: 150,
    role: 'user',
    joinedDate: new Date()
  },
  {
    _id: '2',
    email: 'admin@rewear.com',
    password: '$2b$12$AecOKaOFDjQ1olchDrZ6bO1eSXJKHoWFsGJrAzDg4ZEBSGWh4EzgW', // 'password123'
    firstName: 'Admin',
    lastName: 'User',
    points: 200,
    role: 'admin',
    joinedDate: new Date()
  }
];

// Helper to generate a new string id
const nextId = () => (sampleUsers.length ? (Math.max(...sampleUsers.map(u => Number(u._id))) + 1).toString() : '1')

const sampleItems = [
  {
    _id: '1',
    title: 'Vintage Denim Jacket',
    description: 'Classic 80s style denim jacket in excellent condition. Perfect for layering!',
    category: 'outerwear',
    type: 'jacket',
    size: 'M',
    condition: 'good',
    images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'],
    tags: ['vintage', 'denim', 'classic'],
    pointValue: 75,
    owner: '1',
    status: 'approved',
    isAvailable: true,
    createdAt: new Date()
  },
  {
    _id: '2',
    title: 'Summer Floral Dress',
    description: 'Beautiful floral midi dress, perfect for summer occasions. Barely worn!',
    category: 'dresses',
    type: 'midi dress',
    size: 'S',
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'],
    tags: ['floral', 'summer', 'midi'],
    pointValue: 60,
    owner: '2',
    status: 'approved',
    isAvailable: true,
    createdAt: new Date()
  },
  {
    _id: '3',
    title: 'Designer Sneakers',
    description: 'High-end designer sneakers in great condition. Minor signs of wear on soles.',
    category: 'shoes',
    type: 'sneakers',
    size: '9',
    condition: 'good',
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'],
    tags: ['designer', 'sneakers', 'casual'],
    pointValue: 90,
    owner: '1',
    status: 'approved',
    isAvailable: true,
    createdAt: new Date()
  }
];

// Simple mock implementations that return the sample data
export const mockServices = {
  async findUser(query) {
    if (query.email) {
      return sampleUsers.find(user => user.email === query.email);
    }
    if (query._id) {
      return sampleUsers.find(user => user._id === query._id.toString());
    }
    return null;
  },

  async addUser({ email, password, firstName, lastName, role = 'user', points = 100 }) {
    // Prevent duplicates
    const exists = sampleUsers.find(u => u.email === email)
    if (exists) {
      const err = new Error('User already exists')
      err.code = 'DUPLICATE'
      throw err
    }
    const hashed = await bcrypt.hash(password, 12)
    const user = {
      _id: nextId(),
      email,
      password: hashed,
      firstName,
      lastName,
      points,
      role,
      joinedDate: new Date()
    }
    sampleUsers.push(user)
    // Return a copy without password
    const { password: _p, ...safe } = user
    return safe
  },

  async findItems(filter = {}) {
    let items = [...sampleItems];
    
    if (filter.status) {
      items = items.filter(item => item.status === filter.status);
    }
    if (filter.isAvailable !== undefined) {
      items = items.filter(item => item.isAvailable === filter.isAvailable);
    }
    if (filter.owner) {
      items = items.filter(item => item.owner === filter.owner.toString());
    }
    
    // Add owner information
    return items.map(item => ({
      ...item,
      owner: sampleUsers.find(user => user._id === item.owner) || { firstName: 'Unknown', lastName: 'User' }
    }));
  },

  async findItemById(id) {
    const item = sampleItems.find(item => item._id === id.toString());
    if (!item) return null;
    
    return {
      ...item,
      owner: sampleUsers.find(user => user._id === item.owner) || { firstName: 'Unknown', lastName: 'User' }
    };
  },

  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
};

export { useMockDb };