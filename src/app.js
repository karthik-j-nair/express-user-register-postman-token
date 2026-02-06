const express = require("express");
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser")

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
//  "/api/auth" is just a prefix for register api

module.exports = app