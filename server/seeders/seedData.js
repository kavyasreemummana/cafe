import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kavyasreemummana:kavya121@cluster0.jupnuhk.mongodb.net/cafe?retryWrites=true&w=majority&appName=Cluster0';

const menuItems = [
  {
    name: "Classic Espresso",
    description: "Rich and bold espresso shot with perfect crema",
    price: 3.50,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    category: "Coffee",
    isAvailable: true,
    preparationTime: 3,
    allergens: ["None"],
    nutritionalInfo: {
      calories: 5,
      protein: 0.5,
      carbs: 0.5,
      fat: 0.1
    },
    tags: ["espresso", "strong", "classic"],
    featured: true
  },
  {
    name: "Cappuccino",
    description: "Espresso with steamed milk and foam art",
    price: 4.25,
    image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    category: "Coffee",
    isAvailable: true,
    preparationTime: 5,
    allergens: ["Dairy"],
    nutritionalInfo: {
      calories: 120,
      protein: 8,
      carbs: 12,
      fat: 6
    },
    tags: ["cappuccino", "milk", "foam"],
    featured: true
  },
  {
    name: "Caramel Macchiato",
    description: "Sweet caramel with espresso and steamed milk",
    price: 5.00,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    category: "Coffee",
    isAvailable: true,
    preparationTime: 6,
    allergens: ["Dairy"],
    nutritionalInfo: {
      calories: 180,
      protein: 8,
      carbs: 25,
      fat: 6
    },
    tags: ["caramel", "sweet", "macchiato"],
    featured: false
  },
  {
    name: "Chocolate Croissant",
    description: "Buttery croissant filled with rich chocolate",
    price: 3.75,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    category: "Pastry",
    isAvailable: true,
    preparationTime: 2,
    allergens: ["Gluten", "Dairy", "Eggs"],
    nutritionalInfo: {
      calories: 280,
      protein: 6,
      carbs: 32,
      fat: 16
    },
    tags: ["croissant", "chocolate", "buttery"],
    featured: true
  },
  {
    name: "Blueberry Muffin",
    description: "Fresh baked muffin bursting with blueberries",
    price: 2.95,
    image: "https://thebusybaker.ca/wp-content/uploads/2020/07/blueberry-muffins-3.jpg",
    category: "Pastry",
    isAvailable: true,
    preparationTime: 2,
    allergens: ["Gluten", "Dairy", "Eggs"],
    nutritionalInfo: {
      calories: 320,
      protein: 5,
      carbs: 45,
      fat: 12
    },
    tags: ["muffin", "blueberry", "fresh"],
    featured: false
  },
  {
    name: "Avocado Toast",
    description: "Smashed avocado on artisan sourdough bread",
    price: 7.50,
    image: "https://www.spendwithpennies.com/wp-content/uploads/2025/03/1200-Avocado-Toast-2-SpendWithPennies-1-800x1200.jpg",
    category: "Food",
    isAvailable: true,
    preparationTime: 8,
    allergens: ["Gluten"],
    nutritionalInfo: {
      calories: 320,
      protein: 8,
      carbs: 28,
      fat: 22
    },
    tags: ["avocado", "toast", "healthy"],
    featured: true
  },
  {
    name: "Iced Vanilla Latte",
    description: "Cold brew with vanilla syrup and milk",
    price: 4.50,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    category: "Cold Drinks",
    isAvailable: true,
    preparationTime: 4,
    allergens: ["Dairy"],
    nutritionalInfo: {
      calories: 140,
      protein: 6,
      carbs: 18,
      fat: 5
    },
    tags: ["iced", "vanilla", "latte"],
    featured: false
  },
  {
    name: "Green Tea",
    description: "Premium organic green tea leaves",
    price: 2.75,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    category: "Tea",
    isAvailable: true,
    preparationTime: 3,
    allergens: ["None"],
    nutritionalInfo: {
      calories: 2,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    tags: ["green tea", "organic", "healthy"],
    featured: false
  },
  {
    name: "Chai Latte",
    description: "Spiced Indian tea with steamed milk",
    price: 4.00,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb765ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    category: "Hot Drinks",
    isAvailable: true,
    preparationTime: 5,
    allergens: ["Dairy"],
    nutritionalInfo: {
      calories: 110,
      protein: 6,
      carbs: 12,
      fat: 5
    },
    tags: ["chai", "spiced", "indian"],
    featured: true
  },
  {
    name: "Chocolate Chip Cookie",
    description: "Warm chocolate chip cookie with gooey center",
    price: 2.50,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    category: "Pastry",
    isAvailable: true,
    preparationTime: 2,
    allergens: ["Gluten", "Dairy", "Eggs"],
    nutritionalInfo: {
      calories: 180,
      protein: 2,
      carbs: 22,
      fat: 10
    },
    tags: ["cookie", "chocolate", "warm"],
    featured: false
  }
];

const adminUser = {
  name: "Admin User",
  email: "admin@cafe.com",
  password: "admin123",
  phone: "+91-9876543210",
  role: "admin",
  profile: {
    address: {
      street: "123 Cafe Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India"
    },
    preferences: {
      dietaryRestrictions: ["None"],
      favoriteCategories: ["Coffee", "Pastry"],
      spiceLevel: "Medium"
    }
  },
  isActive: true,
  emailVerified: true,
  phoneVerified: true
};

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Clear existing data
    await MenuItem.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Seed menu items
    const seededMenuItems = await MenuItem.insertMany(menuItems);
    console.log(`Seeded ${seededMenuItems.length} menu items`);

    // Seed admin user
    const seededAdmin = await User.create(adminUser);
    console.log(`Seeded admin user: ${seededAdmin.email}`);

    console.log('Database seeding completed successfully!');
    console.log('\nSample data:');
    console.log('- Menu items:', seededMenuItems.length);
    console.log('- Admin user:', seededAdmin.email);
    console.log('\nYou can now start the server and test the API endpoints.');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeder
seedData();
