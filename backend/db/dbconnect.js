const mongoose = require("mongoose");
// db/dbconnect.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });


async function dbConnect() {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true, // Fixed typo
      useUnifiedTopology: true, // This is recommended to avoid deprecation warnings
    })
    .then(() => {
      console.log('Successfully connected to the database');
    })
    .catch((error) => {
      console.error('Unable to connect to the database');
      console.error(error);
    });
}

module.exports = dbConnect;



