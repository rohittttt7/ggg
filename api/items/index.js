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

let sampleItems = [
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

const mockServices = {
  async findUser(query) {
    if (query._id) {
      return sampleUsers.find(user => user._id === query._id.toString());
    }
    return null;
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
    
    return items.map(item => {
      const owner = sampleUsers.find(user => user._id === item.owner);
      return { ...item, owner: owner || { firstName: 'Unknown', lastName: 'User' } };
    });
  },

  async addItem(itemData, ownerId) {
    const newId = (Math.max(...sampleItems.map(i => parseInt(i._id))) + 1).toString();
    const newItem = {
      _id: newId,
      ...itemData,
      owner: ownerId,
      status: 'approved',
      isAvailable: true,
      createdAt: new Date()
    };
    
    sampleItems.push(newItem);
    
    const owner = sampleUsers.find(user => user._id === ownerId);
    return { ...newItem, owner: owner || { firstName: 'Unknown', lastName: 'User' } };
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

  try {
    if (req.method === 'GET') {
      // Get all approved items (public)
      const { category, size, condition, search, limit } = req.query;
      let filter = { status: 'approved', isAvailable: true };

      if (category) filter.category = category;
      if (size) filter.size = size;
      if (condition) filter.condition = condition;

      const items = await mockServices.findItems(filter);

      let filteredItems = items;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredItems = items.filter(item => 
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      let result = filteredItems;
      const num = parseInt(limit, 10);
      if (!isNaN(num) && num > 0) {
        result = filteredItems.slice(0, num);
      }

      res.json(result);
    } else if (req.method === 'POST') {
      // Auth required
      const user = await auth(req, res);
      if (!user) return;

      const { title, description, category, size, condition, images, tags, pointValue } = req.body;

      if (!title || !description || !category || !size || !condition || !pointValue) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const itemData = {
        title: title.trim(),
        description: description.trim(),
        category,
        size,
        condition,
        images: images || [],
        tags: tags || [],
        pointValue: parseInt(pointValue)
      };

      const newItem = await mockServices.addItem(itemData, user._id);
      res.status(201).json(newItem);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Items API error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}