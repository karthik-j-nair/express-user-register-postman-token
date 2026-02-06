const express = require("express");
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const authRouter = express.Router()
// we use express.Router() in place of express(), because it allow us to create api outside app.js file

authRouter.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
        res.status(409).json({
            message: "User already exists with this email"
        })
    }

    const user = await userModel.create({
        username, email, password
    })

    const token = jwt.sign({
        id: user._id   // here wo add the id(can add email or anything you want with the id like email:user.email) and the jwt secret 
    },
        process.env.JWT_SECRET
    )

    res.cookie("jwt_token", token);

    res.status(201).json({
        message: "user created succcessfully",
        user
    })
})

module.exports = authRouter;