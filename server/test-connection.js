import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kavyasreemummana:kavya121@cluster0.jupnuhk.mongodb.net/cafe?retryWrites=true&w=majority&appName=Cluster0';

const testConnection = async () => {
  try {
    console.log('🔌 Testing MongoDB Atlas connection...');
    console.log('📍 Cluster: cluster0.jupnuhk.mongodb.net');
    console.log('🗄️  Database: cafe');
    console.log('⏳ Connecting...\n');
    
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('🌐 Connection URL:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🔗 Connection state:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    // Test basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections found:', collections.length);
    
    if (collections.length > 0) {
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Check your internet connection');
      console.log('   - Verify the cluster name is correct');
      console.log('   - Ensure the cluster is accessible');
    } else if (error.message.includes('Authentication failed')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Check username and password');
      console.log('   - Verify the user has access to the database');
      console.log('   - Check if IP whitelist is configured');
    }
    
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n🔌 Connection closed');
    }
    process.exit(0);
  }
};

// Run the test
testConnection();
