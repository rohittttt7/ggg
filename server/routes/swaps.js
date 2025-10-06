import express from 'express';
import Swap from '../models/Swap.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create swap request
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, swapType, offeredItemId, message } = req.body;
    
    const requestedItem = await Item.findById(itemId);
    if (!requestedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (!requestedItem.isAvailable) {
      return res.status(400).json({ message: 'Item is not available' });
    }
    
    if (requestedItem.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot swap with your own item' });
    }

    let swapData = {
      requester: req.user._id,
      itemOwner: requestedItem.owner,
      requestedItem: itemId,
      swapType,
      message: message || ''
    };

    if (swapType === 'direct') {
      if (!offeredItemId) {
        return res.status(400).json({ message: 'Offered item is required for direct swap' });
      }
      
      const offeredItem = await Item.findById(offeredItemId);
      if (!offeredItem || offeredItem.owner.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'Invalid offered item' });
      }
      
      swapData.offeredItem = offeredItemId;
    } else if (swapType === 'points') {
      if (req.user.points < requestedItem.pointValue) {
        return res.status(400).json({ message: 'Insufficient points' });
      }
      
      swapData.pointsOffered = requestedItem.pointValue;
    }

    const swap = new Swap(swapData);
    await swap.save();
    
    await swap.populate([
      { path: 'requester', select: 'firstName lastName' },
      { path: 'requestedItem', select: 'title images' },
      { path: 'offeredItem', select: 'title images' }
    ]);

    res.status(201).json({ message: 'Swap request created successfully', swap });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's swap requests (sent and received)
router.get('/my-swaps', auth, async (req, res) => {
  try {
    const sentSwaps = await Swap.find({ requester: req.user._id })
      .populate('itemOwner', 'firstName lastName')
      .populate('requestedItem', 'title images')
      .populate('offeredItem', 'title images')
      .sort({ createdAt: -1 });

    const receivedSwaps = await Swap.find({ itemOwner: req.user._id })
      .populate('requester', 'firstName lastName')
      .populate('requestedItem', 'title images')
      .populate('offeredItem', 'title images')
      .sort({ createdAt: -1 });

    res.json({ sentSwaps, receivedSwaps });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Accept/reject swap request
router.patch('/:id/respond', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const swap = await Swap.findById(req.params.id)
      .populate('requester')
      .populate('requestedItem')
      .populate('offeredItem');
    
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }
    
    if (swap.itemOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (status === 'accepted') {
      // Handle point-based swap
      if (swap.swapType === 'points') {
        // Deduct points from requester and add to owner
        await User.findByIdAndUpdate(swap.requester._id, {
          $inc: { points: -swap.pointsOffered }
        });
        await User.findByIdAndUpdate(swap.itemOwner, {
          $inc: { points: swap.pointsOffered }
        });
      }
      
      // Mark items as swapped
      await Item.findByIdAndUpdate(swap.requestedItem._id, {
        isAvailable: false,
        status: 'swapped',
        swappedWith: swap.requester._id
      });
      
      if (swap.offeredItem) {
        await Item.findByIdAndUpdate(swap.offeredItem._id, {
          isAvailable: false,
          status: 'swapped',
          swappedWith: swap.itemOwner
        });
      }
      
      swap.status = 'completed';
    } else {
      swap.status = 'rejected';
    }

    await swap.save();
    
    res.json({ message: `Swap ${status} successfully`, swap });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;