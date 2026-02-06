const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        unique: [true, "User already exists!! try to login with this email"]
    },
    password: String
})

const noteModel = mongoose.model("users", userSchema);

module.exports = noteModel;