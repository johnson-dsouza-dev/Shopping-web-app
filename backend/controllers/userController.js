// Importing the User model to interact with the user data in the database
import User from "../models/userModel.js";

// Importing the asyncHandler middleware to handle any asynchronous errors in this function
import asyncHandler from "../middleware/asyncHandler.js";

// Defining the createUser function to handle the process of creating a new user
// Wrapping the function with asyncHandler to manage asynchronous errors automatically
const createUser = asyncHandler(async (req, res) => {
  // Destructuring the request body to extract the 'username', 'email', and 'password' fields
  const { username, email, password } = req.body;

  // Check if all required fields (username, email, password) are provided in the request
  if (!username || !email || !password) {
    // If any required field is missing, log a message and throw an error
    console.log("Provide all the data ");
    throw new Error("Please fill all the inputs ");
  }

  // Check if a user already exists with the given email
  const userExists = await User.findOne({ email });

  // If the user already exists, return a 400 status with an error message and stop further execution
  if (userExists) return res.status(400).send("User already exists ");

  // Create a new user instance with the provided 'username', 'email', and 'password'
  const newUser = new User({ username, email, password });

  try {
    // Attempt to save the new user to the database
    await newUser.save();

    // If the user is successfully saved, return a 201 status with the new user's details in JSON format
    res.status(201).json({
      _id: newUser._id, // User's unique ID
      username: newUser.username, // User's username
      email: newUser.email, // User's email
      isAdmin: newUser.isAdmin, // User's admin status (default is false)
    });
  } catch (error) {
    // If an error occurs during saving, set the response status to 400 (Bad Request)
    res.status(400);

    // Throw an error indicating that the provided data is invalid
    throw new Error("Invalid Data");
  }
});

// Exporting the createUser function so it can be used in other files, such as in routes
export { createUser };
