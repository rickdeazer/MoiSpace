import dotenv, { config } from "dotenv"
import express from "express"
import mongoose from "mongoose"
import userModel from "./models/models.js"
import connectionDb from "./Database/database.js"
import { Router } from "./Routes/routes.js"
import cookieParser from "cookie-parser";
dotenv.config()
const app = express()
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use("/", Router)
app.use(express.static("public"))
app.use("/", express.static("html"))
app.use("/mediafiles", express.static("mediafiles"))


app.set("view engine", "ejs")
connectionDb()
const port = process.env.PORT

app.listen(3000, console.log("listening on port 3000"));
