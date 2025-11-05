import dotenv, { config } from "dotenv"
import express from "express"
import cors from "cors";
import mongoose from "mongoose"
import {Messages, userModel} from "./models/models.js"
import connectionDb from "./Database/database.js"
import { Router } from "./Routes/routes.js"
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import fs from "fs";
import path from "path";

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
    Messages.create({
         from: msg.from,
      to: msg.to,
      text: `${msg.text}`,
      time: `${new Date().getHours()}:${new Date().getMinutes()}`
    
      })
  });
  io.on("disconnect", ()=>{
    console.log("Device Disconnected");
  })
});


const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};
ensureDir("./uploads/profile");
ensureDir("./uploads/gallery");

const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname.startsWith("prof")) {
      cb(null, "./uploads/profile");
    } else {
      cb(null, "./uploads/gallery");
    }
  },
  filename: (req, file, cb) => {
    const prefix = file.fieldname.startsWith("prof") ? "prof_" : "gal_";
    cb(null, prefix + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage1 });


app.post("/profile/update/pics", upload.any(), async (req, res) => {
    const username =JSON.parse( req.body.username); 

    let profilePics = req.files.filter(f => f.fieldname.startsWith("prof"));
    const galleryPics = req.files.filter(f => f.fieldname.startsWith("gallery"));

    const profilePicLink = profilePics.length > 0 ? profilePics[0].path : "";
    const galleryLinks = galleryPics.map(f => f.path).join(",");

    let data= await userModel.updateOne(
      { username: username },
      {
        $set: {
          profileLink: profilePicLink,
          gallarieLinks: galleryLinks,
        }
      }
    );
  

    const uploadedFiles = req.files.map((u) => ({
      field: u.fieldname,
      filename: u.filename,
      path: u.path,
    }));

    res.json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });

});


 

server.listen(3000, console.log("listening on port 3000"));
