import dotenv, { config } from "dotenv"
import express from "express"
import cors from "cors";
import mongoose from "mongoose"
import {Messages} from "./models/models.js"
import connectionDb from "./Database/database.js"
import { Router } from "./Routes/routes.js"
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

const app = express()
let server = http.createServer(app);
let io = new Server(server);

dotenv.config()
app.use(cookieParser())
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use("/", Router)
app.use(express.static("public"))
app.use("/", express.static("html"))
app.use("/mediafiles", express.static("mediafiles"))


app.set("view engine", "ejs")
connectionDb()
const port = process.env.PORT

io.on("connection", (socket) => {
  console.log("Device Connected");

  socket.on("message", async (msg) => {
    console.log(msg);
    io.emit("serverReply", {
      from: msg.from,
      to: msg.to,
      text: `${msg.text}`,
    
    });
    new Messages.create({
         from: msg.from,
      to: msg.to,
      text: `${msg.text}`,
      time: `${new Date().getHours}: ${new Date().getMinutes}`
    
      })
  });
  io.on("disconnect", ()=>{
    console.log("Device Disconnected");
  })
});
 

server.listen(3000, console.log("listening on port 3000"));
