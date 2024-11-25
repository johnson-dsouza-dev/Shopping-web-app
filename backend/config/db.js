// Log a message to check if the db.js file is being executed
console.log("db check");

// Import mongoose, a MongoDB object modeling tool
import mongoose from "mongoose";

// Create an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Try to connect to the MongoDB database using the connection string from the environment variable
    await mongoose.connect(process.env.MONGO_URI);

    // If connection is successful, log a success message
    console.log(`Successfully connected to mongoDB `);
  } catch (error) {
    // If an error occurs, log a generic error message
    console.log("Error here");

    // Log the actual error message for debugging
    console.error(`ERROR: ${error.message}`);

    // Exit the process if connection fails
    process.exit(1);
  }
};

// Export the connectDB function so it can be used elsewhere in your app
export default connectDB;
