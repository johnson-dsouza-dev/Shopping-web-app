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
    console.log("Provide all the data");
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

// Function to log in an existing user
const loginUser = asyncHandler(async (req, res) => {
  // Extracting email and password from the request body
  const { email, password } = req.body;

  // Check if the user exists in the database
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // Validate the provided password against the stored hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      // Generate a JWT token and set it as a cookie in the response
      createToken(res, existingUser._id);

      // Return the user details with a 201 (Created) status
      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
      return;
    }
  }

  // If login fails, return a 401 (Unauthorized) error
  res.status(401).json({ message: "Invalid email or password" });
});

// Function to log out the current user
const logoutCurrentUser = asyncHandler(async (req, res) => {
  // Clear the JWT cookie by setting it to an empty string and expiring it immediately
  res.cookie("jwt", "", {
    httpOnly: true, // Ensures the cookie is only accessible by the server
    expires: new Date(0), // Set the cookie to expire immediately
  });

  // Send a 200 (OK) status with a success message
  res.status(200).json({ message: "Logged out user successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found ");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      user.password = hashedPassword;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not Found ");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Canot delete admin user  ");
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed " });
  } else {
    res.status(404);
    throw new Error("User not found  ");
  }
});
// Export the functions for use in routes or other parts of the application
export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
};
