import mongoose from 'mongoose';
import { mockItemDb } from '../mockDb.js';

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'other']
  },
  type: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size']
  },
  condition: {
    type: String,
    required: true,
    enum: ['new', 'like-new', 'good', 'fair', 'poor']
  },
  images: [{
    type: String,
    required: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pointValue: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'available', 'swapped'],
    default: 'pending'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  swappedWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

const MongoItem = mongoose.model('Item', itemSchema);

// Mock Item class
class MockItem {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    const result = await mockItemDb.save(this);
    Object.assign(this, result);
    return this;
  }

  populate(fields) {
    return this;
  }

  static async find(query = {}) {
    return await mockItemDb.find(query);
  }

  static async findById(id) {
    return await mockItemDb.findById(id);
  }

  static async findByIdAndUpdate(id, update, options) {
    return await mockItemDb.findByIdAndUpdate(id, update, options);
  }
}

// Export the appropriate model based on database mode
const Item = global.useMockDb ? MockItem : MongoItem;

export default Item;