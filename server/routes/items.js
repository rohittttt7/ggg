import express from 'express';
import { mockServices } from '../services/mockService.js';

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

// Get item by ID
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

export default router;