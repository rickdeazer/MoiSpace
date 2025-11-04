import express from "express"
import {userModel} from "../models/models.js"
import {validateLogin, validateUser} from "../models/validation.js"
import { authenticate } from "../middlewares/validations.js"
import { giveMainUser, issueData,markAsRead,obtainHistory } from "../middlewares/giver.js"
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
Router.get('/chats/users', issueData)

Router.get('/chats/main', giveMainUser)

Router.get('/chatspage', authenticate, (req,res)=>{
    res.render("chatspage", {user: req.user})
})
Router.get('/interests',authenticate, (req,res)=>{
    res.render("interests",{user: req.user})
})
Router.get('/home',authenticate, (req,res)=>{
    res.render("home",{user: req.user})
})
Router.post("/signup", (req,res)=>{
    validateUser(req.body, res)
})
Router.get("/signup", (req,res)=>{
    res.render("index",{errors})
})
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