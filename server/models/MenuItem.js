import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: 'Price must be a positive number'
    }
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Coffee', 'Tea', 'Pastry', 'Food', 'Cold Drinks', 'Hot Drinks', 'Snacks'],
      message: 'Category must be one of: Coffee, Tea, Pastry, Food, Cold Drinks, Hot Drinks, Snacks'
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    default: 5,
    min: [1, 'Preparation time must be at least 1 minute']
  },
  allergens: [{
    type: String,
    enum: ['Dairy', 'Nuts', 'Gluten', 'Eggs', 'Soy', 'Fish', 'Shellfish']
  }],
  nutritionalInfo: {
    calories: {
      type: Number,
      min: 0
    },
    protein: {
      type: Number,
      min: 0
    },
    carbs: {
      type: Number,
      min: 0
    },
    fat: {
      type: Number,
      min: 0
    }
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

// Virtual for formatted price
menuItemSchema.virtual('formattedPrice').get(function() {
  return `₹${(this.price * 83.5).toFixed(2)}`;
});

// Pre-save middleware to ensure price is rounded to 2 decimal places
menuItemSchema.pre('save', function(next) {
  if (this.price) {
    this.price = Math.round(this.price * 100) / 100;
  }
  next();
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
