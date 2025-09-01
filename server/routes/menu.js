import express from 'express';
import MenuItem from '../models/MenuItem.js';

const router = express.Router();

// GET /api/menu - Get all menu items with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      minPrice,
      maxPrice,
      available,
      featured,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (available !== undefined) {
      filter.isAvailable = available === 'true';
    }
    
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const [menuItems, total] = await Promise.all([
      MenuItem.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      MenuItem.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: menuItems,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu items',
      message: error.message
    });
  }
});

// GET /api/menu/categories - Get all available categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// GET /api/menu/featured - Get featured menu items
router.get('/featured', async (req, res) => {
  try {
    const featuredItems = await MenuItem.find({ featured: true, isAvailable: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    res.json({
      success: true,
      data: featuredItems
    });
  } catch (error) {
    console.error('Error fetching featured items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured items',
      message: error.message
    });
  }
});

// GET /api/menu/:id - Get a specific menu item
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).lean();
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu item',
      message: error.message
    });
  }
});

// POST /api/menu - Create a new menu item (Admin only)
router.post('/', async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    const savedItem = await menuItem.save();
    
    res.status(201).json({
      success: true,
      data: savedItem,
      message: 'Menu item created successfully'
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create menu item',
      message: error.message
    });
  }
});

// PUT /api/menu/:id - Update a menu item (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: updatedItem,
      message: 'Menu item updated successfully'
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update menu item',
      message: error.message
    });
  }
});

// DELETE /api/menu/:id - Delete a menu item (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete menu item',
      message: error.message
    });
  }
});

// PATCH /api/menu/:id/availability - Toggle availability (Admin only)
router.patch('/:id/availability', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    const updatedItem = await menuItem.save();

    res.json({
      success: true,
      data: updatedItem,
      message: `Menu item ${updatedItem.isAvailable ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling availability:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle availability',
      message: error.message
    });
  }
});

export default router;
