import express from 'express';
import { mockServices } from '../services/mockService.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all approved items (public)
router.get('/', async (req, res) => {
  try {
    const { category, size, condition, search, limit } = req.query;
    let filter = { status: 'approved', isAvailable: true };

    if (category) filter.category = category;
    if (size) filter.size = size;
    if (condition) filter.condition = condition;

  const items = await mockServices.findItems(filter);

    // Apply search filter if provided
    let filteredItems = items;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredItems = items.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply limit if provided and valid
    let result = filteredItems;
    const num = parseInt(limit, 10);
    if (!isNaN(num) && num > 0) {
      result = filteredItems.slice(0, num);
    }

    res.json(result);
  } catch (error) {
    console.error('Error in GET /api/items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new item (authenticated)
router.post('/', auth, async (req, res) => {
  try {
    const ownerId = (req.user && (req.user._id || req.user.id || req.user.userId))?.toString();
    if (!ownerId) {
      return res.status(400).json({ message: 'Could not determine user id' });
    }

    const {
      title,
      description,
      category,
      size,
      condition,
      images = [],
      tags = [],
      pointValue
    } = req.body || {};

    // Basic validation
    if (!title || !description || !category || !size || !condition) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const pv = Number(pointValue);
    if (!Number.isFinite(pv) || pv <= 0) {
      return res.status(400).json({ message: 'pointValue must be a positive number' });
    }

    // Normalize arrays
    const imgArr = Array.isArray(images)
      ? images.filter(Boolean).map(String)
      : typeof images === 'string' && images.trim()
        ? images.split(',').map(s => s.trim()).filter(Boolean)
        : [];
    const tagArr = Array.isArray(tags)
      ? tags.filter(Boolean).map(String)
      : typeof tags === 'string' && tags.trim()
        ? tags.split(',').map(s => s.trim()).filter(Boolean)
        : [];

    const created = await mockServices.addItem({
      title: String(title).trim(),
      description: String(description).trim(),
      category: String(category).trim(),
      size: String(size).trim(),
      condition: String(condition).trim(),
      images: imgArr,
      tags: tagArr,
      pointValue: pv,
      owner: ownerId
    });

    res.status(201).json(created);
  } catch (error) {
    console.error('Error in POST /api/items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get item by ID
// NOTE: Keep specific routes above parameterized routes to avoid conflicts
router.get('/:id', async (req, res) => {
  try {
    const item = await mockServices.findItemById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error in GET /api/items/:id:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get items belonging to the authenticated user
router.get('/user/my-items', auth, async (req, res) => {
  try {
    const ownerId = (req.user && (req.user._id || req.user.id || req.user.userId))?.toString();
    if (!ownerId) {
      return res.status(400).json({ message: 'Could not determine user id' });
    }

    const items = await mockServices.findItems({ owner: ownerId, status: 'approved' });
    res.json(items);
  } catch (error) {
    console.error('Error in GET /api/items/user/my-items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new item (List Item)
router.post('/', auth, async (req, res) => {
  try {
    const ownerId = (req.user && (req.user._id || req.user.id || req.user.userId))?.toString();
    if (!ownerId) {
      return res.status(400).json({ message: 'Could not determine user id' });
    }

    const {
      title,
      description,
      category,
      type,
      size,
      condition,
      images,
      imageUrl,
      tags,
      pointValue
    } = req.body;

    // Basic validation
    const required = { title, description, category, type, size, condition, pointValue };
    for (const [k, v] of Object.entries(required)) {
      if (v === undefined || v === null || v === '') {
        return res.status(400).json({ message: `Missing field: ${k}` });
      }
    }

    let imageList = [];
    if (Array.isArray(images)) imageList = images.filter(Boolean);
    if (!imageList.length && typeof imageUrl === 'string' && imageUrl.trim()) {
      imageList = [imageUrl.trim()];
    }
    if (!imageList.length) {
      // Add a placeholder to avoid UI breakage
      imageList = ['/placeholder-image.jpg'];
    }

    let tagList = [];
    if (Array.isArray(tags)) tagList = tags;
    else if (typeof tags === 'string') {
      tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const created = await mockServices.addItem({
      title,
      description,
      category,
      type,
      size,
      condition,
      images: imageList,
      tags: tagList,
      pointValue: Number(pointValue),
      owner: ownerId
    });

    res.status(201).json({ message: 'Item listed successfully', item: created });
  } catch (error) {
    console.error('Error in POST /api/items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new item (List Item)
router.post('/', auth, async (req, res) => {
  try {
    const ownerId = (req.user && (req.user._id || req.user.id || req.user.userId))?.toString();
    if (!ownerId) {
      return res.status(400).json({ message: 'Could not determine user id' });
    }

    const {
      title,
      description,
      category,
      type,
      size,
      condition,
      images,
      imageUrl,
      tags,
      pointValue
    } = req.body;

    // Basic validation
    const required = { title, description, category, type, size, condition, pointValue };
    for (const [k, v] of Object.entries(required)) {
      if (v === undefined || v === null || v === '') {
        return res.status(400).json({ message: `Missing field: ${k}` });
      }
    }

    let imageList = [];
    if (Array.isArray(images)) imageList = images.filter(Boolean);
    if (!imageList.length && typeof imageUrl === 'string' && imageUrl.trim()) {
      imageList = [imageUrl.trim()];
    }
    if (!imageList.length) {
      // Add a placeholder to avoid UI breakage
      imageList = ['/placeholder-image.jpg'];
    }

    let tagList = [];
    if (Array.isArray(tags)) tagList = tags;
    else if (typeof tags === 'string') {
      tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const created = await mockServices.addItem({
      title,
      description,
      category,
      type,
      size,
      condition,
      images: imageList,
      tags: tagList,
      pointValue: Number(pointValue),
      owner: ownerId
    });

    res.status(201).json({ message: 'Item listed successfully', item: created });
  } catch (error) {
    console.error('Error in POST /api/items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;