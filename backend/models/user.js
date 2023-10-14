const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: [true, "Email already exists"]
    },
    password: {
        type: String,
        required: [true, "Please provide your password"],
        unique: false,
    },
    phone: {
        type: String,
        required: false,
        unique: false
    }
});

module.exports = mongoose.model("User", UserSchema);
