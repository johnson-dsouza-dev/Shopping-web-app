// Importing the express library to create a router for handling HTTP requests
import express from "express";

// Importing controller functions for user actions
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "../controllers/userController.js";

import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

// Initializing a new router object to define user-related routes
const router = express.Router();

// Route to handle user registration
// POST request to "/" (e.g., "/api/users/")
// Calls the createUser function to create a new user
router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

// Route to handle user login
// POST request to "/auth" (e.g., "/api/users/auth")
// Calls the loginUser function to authenticate the user and generate a token
router.post("/auth", loginUser);

// Route to handle user logout
// POST request to "/logout" (e.g., "/api/users/logout")
// Calls the logoutCurrentUser function to clear the session cookie
router.post("/logout", logoutCurrentUser);
router.route('/profile').get(authenticate,getCurrentUserProfile).put(authenticate,updateCurrentUserProfile)
// Exporting the router to be used in the application, e.g., in the main server file
export default router;
