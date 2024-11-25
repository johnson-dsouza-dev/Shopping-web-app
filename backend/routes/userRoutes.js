// Importing the express library to create a router for handling HTTP requests
import express from "express";
import { createUser } from "../controllers/userController.js";

// Initializing a new router object to define routes for user-related actions
const router = express.Router();

// Setting up a route for POST requests to "/" (e.g., "/api/users/")
// When a POST request is made to this endpoint, the createUser function will be called to handle it
router.route("/").post(createUser);

// Exporting the router so it can be used in other parts of the application
export default router;
