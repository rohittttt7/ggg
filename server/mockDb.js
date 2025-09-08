// Mock database for development when MongoDB is not available
let users = []
let items = []
let swaps = []
let currentUserId = 1
let currentItemId = 1
let currentSwapId = 1

// User mock functions
export const mockUserDb = {
  async findOne(query) {
    if (query.email) {
      return users.find(user => user.email === query.email)
    }
    if (query._id) {
      return users.find(user => user._id === query._id)
    }
    return null
  },

  async save(userData) {
    const user = {
      _id: currentUserId++,
      ...userData,
      points: userData.points || 100,
      role: userData.role || 'user',
      joinedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    users.push(user)
    return user
  },

  async findByIdAndUpdate(id, update, options) {
    const userIndex = users.findIndex(user => user._id == id)
    if (userIndex === -1) return null
    
    if (update.$inc && update.$inc.points) {
      users[userIndex].points += update.$inc.points
    } else {
      users[userIndex] = { ...users[userIndex], ...update, updatedAt: new Date() }
    }
    
    return users[userIndex]
  },

  async findById(id) {
    return users.find(user => user._id == id)
  }
}

// Item mock functions
export const mockItemDb = {
  async find(query) {
    let result = [...items]
    
    if (query.status) {
      result = result.filter(item => item.status === query.status)
    }
    if (query.isAvailable !== undefined) {
      result = result.filter(item => item.isAvailable === query.isAvailable)
    }
    if (query.owner) {
      result = result.filter(item => item.owner == query.owner)
    }
    if (query.category) {
      result = result.filter(item => item.category === query.category)
    }
    
    // Add populate simulation
    result = result.map(item => ({
      ...item,
      owner: users.find(user => user._id == item.owner) || { firstName: 'Unknown', lastName: 'User' }
    }))
    
    return {
      sort: () => ({
        populate: () => result.slice(0, 20) // Limit results
      }),
      populate: () => ({
        sort: () => result.slice(0, 20)
      })
    }
  },

  async findById(id) {
    const item = items.find(item => item._id == id)
    if (!item) return null
    
    return {
      ...item,
      owner: users.find(user => user._id == item.owner) || { firstName: 'Unknown', lastName: 'User' },
      populate: () => ({
        ...item,
        owner: users.find(user => user._id == item.owner) || { firstName: 'Unknown', lastName: 'User' }
      })
    }
  },

  async save(itemData) {
    const item = {
      _id: currentItemId++,
      ...itemData,
      status: itemData.status || 'pending',
      isAvailable: itemData.isAvailable !== undefined ? itemData.isAvailable : true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    items.push(item)
    
    return {
      ...item,
      populate: () => ({
        ...item,
        owner: users.find(user => user._id == item.owner) || { firstName: 'Unknown', lastName: 'User' }
      })
    }
  },

  async findByIdAndUpdate(id, update, options) {
    const itemIndex = items.findIndex(item => item._id == id)
    if (itemIndex === -1) return null
    
    items[itemIndex] = { ...items[itemIndex], ...update, updatedAt: new Date() }
    
    return {
      ...items[itemIndex],
      populate: () => ({
        ...items[itemIndex],
        owner: users.find(user => user._id == items[itemIndex].owner) || { firstName: 'Unknown', lastName: 'User' }
      })
    }
  }
}

// Swap mock functions
export const mockSwapDb = {
  async save(swapData) {
    const swap = {
      _id: currentSwapId++,
      ...swapData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    swaps.push(swap)
    return swap
  },

  async find(query) {
    let result = [...swaps]
    
    if (query.requester) {
      result = result.filter(swap => swap.requester == query.requester)
    }
    if (query.itemOwner) {
      result = result.filter(swap => swap.itemOwner == query.itemOwner)
    }
    
    return {
      populate: () => ({
        sort: () => result
      })
    }
  },

  async findById(id) {
    return swaps.find(swap => swap._id == id)
  },

  async save(swap) {
    const existingIndex = swaps.findIndex(s => s._id === swap._id)
    if (existingIndex !== -1) {
      swaps[existingIndex] = { ...swap, updatedAt: new Date() }
      return swaps[existingIndex]
    } else {
      swap._id = currentSwapId++
      swap.createdAt = new Date()
      swap.updatedAt = new Date()
      swaps.push(swap)
      return swap
    }
  }
}

// Add some sample data for testing
const sampleUser = {
  email: 'demo@rewear.com',
  password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDeuQKCgqO8Uj/W', // 'password123'
  firstName: 'Demo',
  lastName: 'User',
  points: 150,
  role: 'user'
}

const adminUser = {
  email: 'admin@rewear.com',
  password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDeuQKCgqO8Uj/W', // 'password123'
  firstName: 'Admin',
  lastName: 'User',
  points: 200,
  role: 'admin'
}

// Add sample users
mockUserDb.save(sampleUser)
mockUserDb.save(adminUser)

// Add sample items
const sampleItems = [
  {
    title: 'Vintage Denim Jacket',
    description: 'Classic 80s style denim jacket in excellent condition. Perfect for layering!',
    category: 'outerwear',
    type: 'jacket',
    size: 'M',
    condition: 'good',
    images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'],
    tags: ['vintage', 'denim', 'classic'],
    pointValue: 75,
    owner: 1,
    status: 'approved'
  },
  {
    title: 'Summer Floral Dress',
    description: 'Beautiful floral midi dress, perfect for summer occasions. Barely worn!',
    category: 'dresses',
    type: 'midi dress',
    size: 'S',
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'],
    tags: ['floral', 'summer', 'midi'],
    pointValue: 60,
    owner: 2,
    status: 'approved'
  },
  {
    title: 'Designer Sneakers',
    description: 'High-end designer sneakers in great condition. Minor signs of wear on soles.',
    category: 'shoes',
    type: 'sneakers',
    size: '9',
    condition: 'good',
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'],
    tags: ['designer', 'sneakers', 'casual'],
    pointValue: 90,
    owner: 1,
    status: 'approved'
  }
]

sampleItems.forEach(item => {
  items.push({
    _id: currentItemId++,
    ...item,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  })
})