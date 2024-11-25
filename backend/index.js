// Log a message to check if index.js is being executed
console.log("index check");

// Import necessary packages
import path from "path"; // Module for handling and transforming file paths
import express from "express"; // Express framework for building the server
import dotenv from "dotenv"; // Package to load environment variables from a .env file
import cookieParser from "cookie-parser"; // Middleware to parse cookies in incoming requests
import userRoutes from "./routes/userRoutes.js";

// Import the database connection utility
import connectDB from "./config/db.js";

// Load environment variables from the .env file
dotenv.config();

// Set the port for the server to run on (defaults to 5000 if not set in .env)
const port = process.env.PORT || 5000;

// Call the function to connect to the database
connectDB();

// Initialize an Express application
const app = express();

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Middleware to parse URL-encoded bodies (such as form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies sent with incoming requests
app.use(cookieParser());

// Define a simple route for the root path
// app.get("/", (req, res) => {
//   // Send a "Hello world" message as a response
//   res.send("Hellooooooooooooooooo worldddddddddddd");
// });

// Mount the userRoutes router to handle all requests to the "/api/users" endpoint
// This means any request starting with "/api/users" will be routed to the userRoutes middleware
app.use("/api/users", userRoutes);

// Start the Express server and listen on the specified port
app.listen(port, () => console.log(`Server running on port : ${port}`));
