// const mongoose = require('mongoose');
// const config = require('./config');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(config.mongoUri);
//     console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
//     return conn;
//   } catch (error) {
//     console.error(`MongoDB Connection Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;




const mongoose = require('mongoose');
const config = require('./config');

// Cache the connection across serverless invocations
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    if (!config.mongoUri) {
      throw new Error('mongoUri is not set (check MONGO_URI in environment variables)');
    }
    cached.promise = mongoose
      .connect(config.mongoUri, { bufferCommands: false })
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
      })
      .catch((error) => {
        console.error(`MongoDB Connection Error: ${error.message}`);
        cached.promise = null; // allow retry on the next request
        throw error;           // no process.exit(1): it would kill the serverless function
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;