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

// Get user's items
router.get('/my-items', auth, async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get item by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findOne({ 
      _id: req.params.id,
      owner: req.user._id 
    }).populate('owner', 'name email verified');
    
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

export default router; 