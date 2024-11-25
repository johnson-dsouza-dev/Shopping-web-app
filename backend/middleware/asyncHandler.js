// Defining an asyncHandler function to handle errors in asynchronous functions more easily
// It takes an asynchronous function (fn) as input and returns a new function
const asyncHandler = (fn) => (req, res, next) => {
  
  // Executes the provided async function and catches any errors that occur
  Promise.resolve(fn(req, res, next)).catch((error) => {
    
    // If an error occurs, respond with a 500 status and send the error message as JSON
    res.status(500).json({ message: error.message });
  });
};

// Exporting asyncHandler to use it in other parts of the application
export default asyncHandler;
