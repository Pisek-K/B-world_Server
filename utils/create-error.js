const createError = (code, message) => {
    const error = new Error(message);
    error.statusCode = code;
    throw error;
  };
  
module.exports = createError;