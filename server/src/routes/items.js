import express from 'express';
import Item from '../models/Item.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create a new item
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating item with data:', req.body); // Debug log
    console.log('User:', req.user._id); // Debug log

    const item = new Item({
      ...req.body,
      owner: req.user._id
    });

    console.log('Item before save:', item); // Debug log

    await item.save();
    
    console.log('Item saved successfully'); // Debug log

    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error); // Debug log
    res.status(400).json({ 
      message: error.message,
      details: error.errors // Include mongoose validation errors if any
    });
  }
});

// Get all items for browsing (excluding user's own items)
router.get('/browseItems', auth, async (req, res) => {
  try {
    const items = await Item.find({ 
      status: { $ne: 'deleted' },
      owner: { $ne: req.user._id } // Exclude user's own items
    })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

// Get user's items
router.get('/my-items', auth, async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get item by ID (Keep this AFTER other specific routes)
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'name email verified');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Add default owner response time
    const itemWithDefaults = {
      ...item.toObject(),
      owner: {
        ...item.owner.toObject(),
        responseTime: '< 1 hour' // You can make this dynamic later
      }
    };
    
    res.json(itemWithDefaults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { rules, features, ...otherUpdates } = req.body;

    // Find the item and verify ownership
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    // Update the item
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      {
        ...otherUpdates,
        ...(rules !== undefined && { rules }),
        ...(features !== undefined && { features })
      },
      { new: true }
    ).populate('owner', 'name email avatar rating');

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item' });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findOne({ 
      _id: req.params.id,
      owner: req.user._id 
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add this route to handle item status updates
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const item = await Item.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error updating item status:', error);
    res.status(500).json({ message: 'Error updating item status' });
  }
});

export default router; 