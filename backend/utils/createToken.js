import jwt from "jsonwebtoken";

// Function to generate a JWT token and set it as an HTTP-only cookie
const generateToken = (res, userId) => {
  // Create a JWT token with the user's ID as payload, using a secret key and a 30-day expiration
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token validity: 30 days
  });

  // Set the JWT token as a secure, HTTP-only cookie in the response
  res.cookie("jwt", token, {
    httpOnly: true, // Cookie is only accessible by the server, not JavaScript in the browser
    secure: process.env.NODE_ENV !== "development", // Use HTTPS in production
    sameSite: "strict", // Prevent CSRF by restricting cross-site requests
    maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration: 30 days
  });

  return token; // Return the token for potential further use
};

export default generateToken;
