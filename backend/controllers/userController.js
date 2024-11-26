// Importing the User model to interact with the user data in the database
import User from "../models/userModel.js";

// Importing asyncHandler to handle asynchronous errors automatically
import asyncHandler from "../middleware/asyncHandler.js";

// Importing bcrypt for password hashing
import bcrypt from "bcryptjs/dist/bcrypt.js";

// Importing the createToken utility to generate a JWT token for the user
import createToken from "../utils/createToken.js";

// Function to create a new user
// Wrapped with asyncHandler to handle errors in asynchronous operations
const createUser = asyncHandler(async (req, res) => {
  // Extracting username, email, and password from the request body
  const { username, email, password } = req.body;

  // Ensure all required fields are provided
  if (!username || !email || !password) {
    console.log("Provide all the data ");
    throw new Error("Please fill all the inputs");
  }

  // Check if a user already exists with the given email
  const userExists = await User.findOne({ email });

  if (userExists) {
    // If user exists, return 400 status with an appropriate message
    return res.status(400).send("User already exists");
  }

  // Generate a salt and hash the password for secure storage
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user object with the provided details
  const newUser = new User({
    username,
    email,
    password: hashedPassword, // Store hashed password
  });

  try {
    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token and set it as a cookie in the response
    createToken(res, newUser._id);

    // Return the newly created user details with a 201 (Created) status
    res.status(201).json({
      _id: newUser._id, // Unique user ID
      username: newUser.username, // User's name
      email: newUser.email, // User's email address
      isAdmin: newUser.isAdmin, // Indicates if the user is an admin (default: false)
    });
  } catch (error) {
    // Handle errors during the save operation
    res.status(400); // Set response status to 400 (Bad Request)
    throw new Error("Invalid Data"); // Provide an error message
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPaswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPaswordValid) {
      createToken(res, existingUser._id);

      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
      return;
    }
  }
});

// Export the createUser function for use in routes or other parts of the application
export { createUser, loginUser };
