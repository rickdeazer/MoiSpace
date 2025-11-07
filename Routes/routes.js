import express from "express"
import {userModel,Messages} from "../models/models.js"
import {validateLogin, validateUser} from "../models/validation.js"
import { authenticate,sanity } from "../middlewares/validations.js"
import { giveMainUser, giveUserPage, giveUserProfile, issueData,markAsRead,obtainHistory, unreadFinder } from "../middlewares/giver.js"
const Router = express.Router()
let errors = [];

Router.get("/",(req,res)=>{
    res.render("login", {errors})
})//hello 
Router.get("/login", (req,res)=>{
    res.render("login", {errors});
})
Router.get('/chats',authenticate,(req,res)=>{
    res.render("chats", {user: req.user})
})
Router.get('/chats/users',authenticate,issueData)

Router.get('/chats/main',authenticate,giveMainUser)

Router.get('/chatspage', authenticate, (req,res)=>{
    res.render("chatspage", {user: req.user})
})
Router.get('/interests',authenticate, (req,res)=>{
    res.render("interests",{user: req.user})
})
Router.get('/home',authenticate,sanity,unreadFinder)
Router.post("/signup", (req,res)=>{
    validateUser(req.body, res)
})
Router.get("/signup", (req,res)=>{
    res.render("index",{errors})
})
Router.get("/user",authenticate,(req,res)=>{
    res.render("foreignUser",{user:req.user})
})
Router.get("/userProfile",authenticate,giveUserProfile)
Router.post("/user",authenticate,sanity,giveUserPage);
Router.get("/logout",authenticate,(req,res)=>{
    res.cookie("token","Logged out User",{
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24*60*60*1000
    })
    res.render("login",{errors:['You Logged Out']})})
Router.post("/login",  async (req, res)=>{
   const Login = await validateLogin(req.body, res)
   if (Login.status == 'success'){
    const {token,user} = Login;
       res.cookie("token",token,{
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24*60*60*1000},)
       res.redirect("home")
   } else {
    const {errors} = Login
    res.render("login",{errors})
   }
})
Router.post("/markAsRead", markAsRead)
Router.post("/chat/path4", obtainHistory)
export { Router};
Router.post("/everyone",authenticate,async (req, res) => {
  let data = await userModel
    .find({})
    .select("-password -_id -phone -updatedAt -createdAt");
  res.json({ data: data });
});
