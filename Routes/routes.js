import express from "express"
import userModel from "../models/models.js"
import { authenticate, validateLogin, validateUser} from "../models/validation.js"
const Router = express.Router()
let errors = [];

Router.get("/", (req,res)=>{
    res.render("login", {errors})
})
Router.get("/login", (req,res)=>{
    res.render("login", {errors});
})
Router.get('/chats',authenticate, (req,res)=>{
    res.render("chats",{user: req.user})
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
Router.post("/login", async (req, res)=>{
   const Login = await validateLogin(req.body, res)
   if (Login.status == 'success'){
    const {token,user} = Login;
       res.cookie("token",token,{
        httpOnly: true,
        secure: true,
        maxAge: 24*60*60*1000})
       res.redirect("home")
   } else {
    const {errors} = Login
    res.render("login",{errors})
   }
})
export { Router};