// Import mongoose
const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * This function handles the connection and error handling
 */
async function connectDB() {
  try {
    // Attempt to connect using the URI from environment
    await mongoose.connect(process.env.MONGO_URI);
    
    // If successful, log the connection
    console.log('✅ MongoDB connected successfully!');
    
    // Also log which database we're using (helpful for debugging)
    console.log(`📁 Using database: ${mongoose.connection.db.databaseName}`);
    
    // Optional: Log connection details
    console.log(`🔌 Connected to: ${mongoose.connection.host}`);
    
  } catch (error) {
    // If connection fails, log the error
    console.error('❌ MongoDB connection failed!');
    console.error(`📝 Error: ${error.message}`);
    
    // Exit the process with failure
    // This stops the server from running without a database
    process.exit(1);
  }
}

// Export the function so other files can use it
module.exports = connectDB;