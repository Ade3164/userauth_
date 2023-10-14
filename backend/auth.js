const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
  try {
    const token = request.headers.authorization.split(" ")[1]; // Corrected from "header" to "headers"

    const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");

    // Assuming you want to attach the user object to the request
    request.user = decodedToken;

    next();
  } catch (error) {
    response.status(401).json({ error: "Invalid request!" }); // Fixed the response format
  }
};
