const express = require("express");
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const authRouter = express.Router()
// we use express.Router() in place of express(), because it allow us to create api outside app.js file


/**
 *  for register
 */
authRouter.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
        return res.status(409).json({
            message: "User already exists with this email"
        })
    }

    const hash = crypto.createHash("md5").update(password).digest("hex");

    const user = await userModel.create({
        username, email, password: hash
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

/**
 * for login
 */

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const userRegistered = await userModel.findOne({ email }); // isUserRegistered gets the detail of the user which have that particular email

    if (!userRegistered) {
        return res.status(404).json({
            message: "User not registered"
        })
    }


    const isCorrectPassword = userRegistered.password === crypto.createHash("md5").update(password).digest("hex");

    if (!isCorrectPassword) {
        return res.status(401).json({
            message: "Incorrect password"
        })
    }

    const token = jwt.sign({
        id: userRegistered._id
    },
        process.env.JWT_SECRET
    )

    res.cookie("jwt_token", token);

    res.status(200).json({
        message: "login successfull!!"
    })


})

module.exports = authRouter;