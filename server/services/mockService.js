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

// Helper to generate new string ids
const nextUserId = () => (sampleUsers.length ? (Math.max(...sampleUsers.map(u => Number(u._id))) + 1).toString() : '1')
const nextItemId = () => (sampleItems.length ? (Math.max(...sampleItems.map(i => Number(i._id))) + 1).toString() : '1')

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
  },
  {
    _id: '4',
    title: 'Leather Boots',
    description: 'Sturdy brown leather boots, perfect for autumn and winter. Some scuffs but lots of life left.',
    category: 'shoes',
    type: 'boots',
    size: '10',
    condition: 'fair',
    images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400'],
    tags: ['leather', 'boots', 'brown'],
    pointValue: 55,
    owner: '2',
    status: 'approved',
    isAvailable: true,
    createdAt: new Date()
  },
  {
    _id: '5',
    title: 'Striped T-Shirt',
    description: 'Casual striped tee, soft cotton, great for everyday wear.',
    category: 'tops',
    type: 't-shirt',
    size: 'L',
    condition: 'good',
    images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400'],
    tags: ['striped', 'casual', 'cotton'],
    pointValue: 25,
    owner: '1',
    status: 'approved',
    isAvailable: true,
    createdAt: new Date()
  },
  {
    _id: '6',
    title: 'Wool Scarf',
    description: 'Warm wool scarf, hand-knitted, perfect for cold weather.',
    category: 'accessories',
    type: 'scarf',
    size: 'One Size',
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400'],
    tags: ['wool', 'scarf', 'handmade'],
    pointValue: 20,
    owner: '2',
    status: 'approved',
    isAvailable: true,
    createdAt: new Date()
  },
  {
    _id: '7',
    title: 'Black Skinny Jeans',
    description: 'Classic black skinny jeans, stretch fit, lightly worn.',
    category: 'bottoms',
    type: 'jeans',
    size: 'M',
    condition: 'good',
    images: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400'],
    tags: ['jeans', 'black', 'skinny'],
    pointValue: 40,
    owner: '1',
    status: 'approved',
    isAvailable: true,
    createdAt: new Date()
  },
  {
    _id: '8',
    title: 'Raincoat',
    description: 'Waterproof yellow raincoat, cheerful and practical for rainy days.',
    category: 'outerwear',
    type: 'raincoat',
    size: 'XL',
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400'],
    tags: ['raincoat', 'yellow', 'waterproof'],
    pointValue: 65,
    owner: '2',
    status: 'approved',
    isAvailable: true,
    createdAt: new Date()
  },
  {
    _id: '9',
    title: 'Red Beanie',
    description: 'Bright red beanie, soft and warm, adds a pop of color to any outfit.',
    category: 'accessories',
    type: 'beanie',
    size: 'One Size',
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400'],
    tags: ['beanie', 'red', 'warm'],
    pointValue: 15,
    owner: '1',
    status: 'approved',
    isAvailable: true,
    createdAt: new Date()
  },
  {
    _id: '10',
    title: 'Plaid Shirt',
    description: 'Classic plaid button-up shirt, comfortable and stylish.',
    category: 'tops',
    type: 'shirt',
    size: 'XL',
    condition: 'good',
    images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400'],
    tags: ['plaid', 'shirt', 'button-up'],
    pointValue: 35,
    owner: '2',
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
      _id: nextUserId(),
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

  async addItem({ title, description, category, size, condition, images = [], tags = [], pointValue, owner }) {
    // Minimal validation in mock layer too
    if (!title || !description || !category || !size || !condition || !owner) {
      const err = new Error('Missing required fields')
      err.code = 'VALIDATION'
      throw err
    }
    const pv = Number(pointValue)
    if (!Number.isFinite(pv) || pv <= 0) {
      const err = new Error('Invalid pointValue')
      err.code = 'VALIDATION'
      throw err
    }

    const newItem = {
      _id: nextItemId(),
      title: String(title).trim(),
      description: String(description).trim(),
      category: String(category).trim(),
      type: '',
      size: String(size).trim(),
      condition: String(condition).trim(),
      images: Array.isArray(images) ? images : [],
      tags: Array.isArray(tags) ? tags : [],
      pointValue: pv,
      owner: owner.toString(),
      status: 'approved',
      isAvailable: true,
      createdAt: new Date()
    }
    sampleItems.push(newItem)
    // Return safe item with owner attached like findItemById
    const ownerUser = sampleUsers.find(u => u._id === newItem.owner)
    const safeOwner = ownerUser ? (({ password, ...rest }) => rest)(ownerUser) : { firstName: 'Unknown', lastName: 'User' }
    return { ...newItem, owner: safeOwner }
  },

  async findItems(filter = {}) {
    console.log('MockService: Total sampleItems:', sampleItems.length);
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
    
    // Add owner information (omit password)
    return items.map(item => {
      const owner = sampleUsers.find(user => user._id === item.owner);
      if (!owner) return { ...item, owner: { firstName: 'Unknown', lastName: 'User' } };
      const { password, ...safeOwner } = owner;
      return { ...item, owner: safeOwner };
    });
  },

  async findItemById(id) {
    const item = sampleItems.find(item => item._id === id.toString());
    if (!item) return null;
    
    const owner = sampleUsers.find(user => user._id === item.owner);
    if (!owner) {
      return { ...item, owner: { firstName: 'Unknown', lastName: 'User' } };
    }
    const { password, ...safeOwner } = owner;
    return { ...item, owner: safeOwner };
  },

  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
};

// Add item creation for mock mode
mockServices.addItem = async function addItem(data) {
  const required = ['title','description','category','type','size','condition','pointValue','owner'];
  for (const f of required) {
    if (data[f] === undefined || data[f] === null || data[f] === '') {
      const err = new Error(`Missing field: ${f}`);
      err.code = 'VALIDATION';
      throw err;
    }
  }
  const id = (sampleItems.length ? (Math.max(...sampleItems.map(x => Number(x._id))) + 1) : 11).toString();
  const item = {
    _id: id,
    title: String(data.title).trim(),
    description: String(data.description).trim(),
    category: data.category,
    type: data.type,
    size: data.size,
    condition: data.condition,
    images: Array.isArray(data.images) && data.images.length ? data.images : ['/placeholder-image.jpg'],
    tags: Array.isArray(data.tags) ? data.tags : [],
    pointValue: Number(data.pointValue) || 1,
    owner: data.owner.toString(),
    status: 'approved',
    isAvailable: true,
    createdAt: new Date()
  };
  sampleItems.push(item);
  const owner = sampleUsers.find(u => u._id === item.owner);
  const { password, ...safeOwner } = owner || {};
  return { ...item, owner: owner ? safeOwner : { firstName: 'Unknown', lastName: 'User' } };
}

export { useMockDb };