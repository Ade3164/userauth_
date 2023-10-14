const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbConnect = require('./db/dbconnect');
const bcrypt = require("bcrypt");
const User = require('./models/user'); 
const jwt = require("jsonwebtoken");
const user = require("./models/user");
const auth = require("./auth")

dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});




// Body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({message:"Welcome to my server"});
  next();
});

// POST endpoint for user registration
app.post("/register", (request, response) => {
  bcrypt.hash(request.body.password, 10)
    .then((hashedPassword) => {
      // Create a new user instance and collect the data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
        phone:request.body.phone
        // Use the hashed password
      });

      user.save()
        .then((result) => {
          response.status(201).json({
            message: "User Created Successfully",
            result,
          });
        })
        .catch((error) => {
          response.status(500).json({
            message: "Failed to create the user",
            error: error.message // Display the error message
          });
        });
    })
    .catch((error) => {
      response.status(500).json({
        message: "Password hashing failed",
        error: error.message // Display the error message
      });
    });
});
// login endpoint
app.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {

          // check if password does not matches
          if(!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

app.get("/free-endpoint", (request, response, next)=>{
  
  response.json({message:"you are free to acess me"});
});

app.get("/auth-endpoint", auth,  (request, response, next)=>{
  
  response.json({message: "you are authorized to acess me"});

});


module.exports = app;
