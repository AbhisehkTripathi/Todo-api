const app = require('../index'); // Import the app from the root directory
const serverless = require('serverless-http'); // Use serverless-http to convert express to serverless

module.exports.handler = serverless(app); // Export handler as serverless function
