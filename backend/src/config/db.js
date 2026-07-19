const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uris = [process.env.MONGODB_URI, 'mongodb://127.0.0.1:27017/todo-app'].filter(Boolean);

  for (const uri of uris) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn.connection;
    } catch (error) {
      console.warn(`MongoDB connection failed for ${uri}: ${error.message}`);
    }
  }

  console.error('Database connection error: no MongoDB instance reachable');
  return null;
};

module.exports = connectDB;
