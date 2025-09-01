import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  specialInstructions: {
    type: String,
    maxlength: [200, 'Special instructions cannot exceed 200 characters']
  },
  customization: [{
    name: String,
    price: {
      type: Number,
      default: 0
    }
  }]
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true
    }
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
      message: 'Status must be one of: pending, confirmed, preparing, ready, completed, cancelled'
    },
    default: 'pending'
  },
  orderType: {
    type: String,
    enum: {
      values: ['dine-in', 'takeaway', 'delivery'],
      message: 'Order type must be one of: dine-in, takeaway, delivery'
    },
    required: true
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: [0, 'Delivery fee cannot be negative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  paymentMethod: {
    type: String,
    enum: {
      values: ['cash', 'card', 'upi', 'online'],
      message: 'Payment method must be one of: cash, card, upi, online'
    },
    required: true
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'failed', 'refunded'],
      message: 'Payment status must be one of: pending, paid, failed, refunded'
    },
    default: 'pending'
  },
  estimatedPreparationTime: {
    type: Number,
    min: [1, 'Estimated preparation time must be at least 1 minute']
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  notes: {
    type: String,
    maxlength: [300, 'Notes cannot exceed 300 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

// Virtual for order summary
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for formatted total
orderSchema.virtual('formattedTotal').get(function() {
  return `₹${(this.total * 83.5).toFixed(2)}`;
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get count of orders for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const todayOrderCount = await this.constructor.countDocuments({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    });
    
    this.orderNumber = `ORD${year}${month}${day}${(todayOrderCount + 1).toString().padStart(3, '0')}`;
  }
  
  // Calculate totals if not set
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      const customizationTotal = item.customization.reduce((cSum, custom) => cSum + custom.price, 0);
      return sum + itemTotal + customizationTotal;
    }, 0);
    
    this.total = this.subtotal + this.tax + this.deliveryFee;
  }
  
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
