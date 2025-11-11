// server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import fs from "fs";
import connectionDb from "./Database/database.js";
import { interests, Messages, userModel } from "./models/models.js";
import { Router } from "./Routes/routes.js";
import { authenticate } from "./middlewares/validations.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use("/", Router);
app.use(express.static("public"));
app.use("/", express.static("html"));
app.use("/mediafiles", express.static("mediafiles"));
app.use("/uploads", express.static("uploads"));

app.set("view engine", "ejs");
connectionDb();

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("Device Connected");

  socket.on("message", async (msg) => {
    console.log("socket message:", msg);
    io.emit("serverReply", {
      from: msg.from,
      to: msg.to,
      text: `${msg.text}`,
    });

    await Messages.create({
      from: msg.from,
      to: msg.to,
      text: `${msg.text}`,
      time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    });
  });

  socket.on("disconnect", () => {
    console.log("Device Disconnected");
  });
});

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};
ensureDir("./uploads/profile");
ensureDir("./uploads/gallery");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname.startsWith("prof")) cb(null, "./uploads/profile");
    else cb(null, "./uploads/gallery");
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"), false);
    }
    cb(null, true);
  },
});

app.post("/profile/update/pics", upload.any(), async (req, res) => {
    const username = JSON.parse(req.body.username);
    if (!username)
      return res.json({ message: "username required" });

    let user = await userModel.findOne({ username: username });

    let existingGallery = [];
    if (user.gallaryLinks) {
      if (Array.isArray(user.gallaryLinks))
        existingGallery = [...user.gallaryLinks];
      else if (
        typeof user.gallaryLinks === "string" &&
        user.gallaryLinks.length
      )
        existingGallery = user.gallaryLinks.split(",").filter(Boolean);
    }

    const updateObj = {};

    for (const f of req.files) {
      if (f.fieldname.startsWith("prof")) {
        const url = `/uploads/profile/${f.filename}`;
        updateObj.profileLink = url;
      } else if (f.fieldname.startsWith("gallery_")) {
        const parts = f.fieldname.split("_");
        const idx = parseInt(parts[1], 10);
        const url = `/uploads/gallery/${f.filename}`;

        if (!Number.isNaN(idx)) {
          while (existingGallery.length <= idx) existingGallery.push("");
          existingGallery[idx] = url;
        } else {
          existingGallery.push(url);
        }
      } else {
        existingGallery.push(`/uploads/gallery/${f.filename}`);
      }
    }

    if (existingGallery.length > 0) {
      updateObj.gallaryLinks = existingGallery.join(",");
    }

    if (Object.keys(updateObj).length === 0) {
      return res.json({ message: "No files were provided" });
    }

    await userModel.updateOne({ username }, { $set: updateObj });

    const files = req.files.map((u) => ({
      field: u.fieldname,
      filename: u.filename,
      url: u.fieldname.startsWith("prof")
        ? `/uploads/profile/${u.filename}`
        : `/uploads/gallery/${u.filename}`,
    }));

    return res.json({
      message: "Files uploaded and user updated successfully",
      files,
      update: updateObj,
    });

});
app.post("/profile/update/text",authenticate, async (req, res) => {
  let username = req.user.username
  let {  course, year, aboutMe, aboutYou, slogan } = req.body;
  if (!username) return res.status(400).json({ message: "username required" });

  if (typeof username !== "string") username = String(username);

  const updateObj = {};
  const setIf = (key, value) => {
    if (typeof value === "string") {
      if (value.trim().length > 0) updateObj[key] = value;
    } else if (value !== undefined && value !== null) {
      updateObj[key] = value;
    }
  };

  setIf("course", course);
  setIf("year", year);
  setIf("aboutMe", aboutMe);
  setIf("aboutYou", aboutYou);
  setIf("slogan", slogan);

  if (Object.keys(updateObj).length === 0) {
    return res.json({ message: "No valid fields provided to update" });
  }

  await userModel.updateOne({ username }, { $set: updateObj });

  return res.json({ message: "Profile updated", update: updateObj });
});

app.post("/interest/info/sent", async (req, res)=>{
  let arr1= await userModel.find({    
    username: req.body.username
  }).select("username profileLink")
  res.json({info: arr1})
})

app.post("/interest/info/received", async (req, res)=>{
  let arr1= await userModel.find({
    username: req.body.username
  }).select("username profileLink")
  
  res.json({info: arr1})
})

app.post("/interests/accept", async (req, res)=>{
  try{
  const {to,from} = req.body
  const updateState = await interests.updateMany({to: to, from: from},{$set: {status: "interested"}})
  res.json({status: true})
  } catch{error=>{
    res.json({status: false, error: error})

  }}
  })

  app.post("/interests/decline", async (req, res)=>{
  try{
  const {to,from} = req.body
  const updateState = await interests.updateMany({to: to, from: from},{$set: {status: "declined"}})
  res.json({status: true})
  } catch{error=>{
    res.json({status: false, error: error})

  }}
  })
server.listen(3000, console.log("listening on port 3000"));
