// Importing the mongoose library to define and interact with MongoDB models
import mongoose from "mongoose";

// Creating a new schema for the "User" model, defining the structure of user documents in MongoDB
const userSchema = mongoose.Schema(
  {
    // Defining the 'username' field, a required string for each user
    username: {
      type: String,
      required: true,
    },
    // Defining the 'email' field, which must be unique and is required for each user
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Defining the 'password' field, a required string for storing each user's password
    password: {
      type: String,
      required: true,
    },
    // Defining the 'isAdmin' field, a Boolean indicating admin status, defaulting to false
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  // Enabling timestamps to automatically add 'createdAt' and 'updatedAt' fields to each document
  { timestamps: true }
);

// Creating the 'User' model from the userSchema, representing a collection in MongoDB
const User = mongoose.model("User", userSchema);

// Exporting the 'User' model to be used in other parts of the application
export default User;
