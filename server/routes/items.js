import express from 'express';
import multer from 'multer';
import path from 'path';
import Item from '../models/Item.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all approved items (public)
router.get('/', async (req, res) => {
  try {
    const { category, size, condition, search } = req.query;
    let filter = { status: 'approved', isAvailable: true };

    if (category) filter.category = category;
    if (size) filter.size = size;
    if (condition) filter.condition = condition;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const items = await Item.find(filter)
      .populate('owner', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'firstName lastName points');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new item
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, category, type, size, condition, tags, pointValue } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const images = req.files.map(file => `/uploads/${file.filename}`);
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const item = new Item({
      title,
      description,
      category,
      type,
      size,
      condition,
      images,
      tags: tagsArray,
      pointValue: parseInt(pointValue),
      owner: req.user._id
    });

    await item.save();
    await item.populate('owner', 'firstName lastName');

    res.status(201).json({ message: 'Item created successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's items
router.get('/user/my-items', auth, async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin routes
// Get all items for moderation
router.get('/admin/pending', adminAuth, async (req, res) => {
  try {
    const items = await Item.find({ status: 'pending' })
      .populate('owner', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve/reject item
router.patch('/admin/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('owner', 'firstName lastName');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: `Item ${status} successfully`, item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;