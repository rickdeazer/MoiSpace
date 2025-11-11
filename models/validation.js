import { profile } from "console";
import { findUser} from "./saveFunctions.js";
import { validate } from "./saveFunctions.js";
import jwt from "jsonwebtoken"
let errors = [];
const validateUser = async (userData, res)=>{
const {usernameS, passwordS, phoneS, passwordCS } = userData

let username = usernameS
let password = passwordS
let phone = phoneS
errors = []
if (typeof(username)!== "string") username = "";

username = username.trim()

if (username && username.length <3) errors.push("Username must be atleast 4 characters")

if (username && username.length >12) errors.push("Username must not exceed 12 characters")

if (!username) {errors.push("You must provide a username")} else {
if (!username.match(/^[a-zA-Z0-9_-]+$/)) errors.push("Username can only contain letters and numbers")}

if (phone.length !== 9 && phone.length !== 10) {
  if (!phone) {errors.push("You must enter phone number")} else {errors.push("Phone must have 10 digits")}
}

if (password) {
 if (password.length > 12) {errors.push("Password cannot exceed 8 characters")}
} else {errors.push("You must provide a password")}

  phone = phone.trim()
if (phone && !phone.match(/^[0-9]+$/)) errors.push("Invalid phone number")
if (!passwordCS) {errors.push("You must confirm your password")} else {
if(password != passwordCS) errors.push("Passwords do not match")}


if (errors.length) {
    console.log(errors);
    return res.render("index", {errors})}


     else {
     const validationResults = await validate(username, password, phone)
     if (validationResults.success){
        res.render("login", {errors: ['Your Account has been created']})
     } else {
      res.render("index", {errors: [`${validationResults.statusCode}, Conflict`,`${validationResults.message}`]})
     }
  
     }}

     const validateLogin = async (userData)=>{
      errors = []
      let {usernameL, passwordL } = userData
      let username = usernameL
      let password = passwordL;
      if (!username){
      errors.push("Please provide a username")
      } else if (username.length <3 ) {errors.push("Invalid username (<3 char)")} else if (username.length > 12) {errors.push ("invalid username (>12 char)")}
    
      if (!password){
        errors.push("Please provide a password")
      }

      if (errors.length) {
        return {status: 'failed', errors}
      } else {
        const findResults = await findUser(username, password)

       if (findResults.status == 'success') {
       let user = findResults.user;
        // Convert timestamps to local time
       const token = jwt.sign({
        userId: user._id,
        username: user.username,
        profileLink:user.profileLink
       }, process.env.JWT_SECRET, {expiresIn: '30m'});
        // user = {
        //     ...user._doc, // keep other fields
        //     createdAt: new Date(user.createdAt).toLocaleString('en-US', {timeZone: 'Africa/Nairobi'}),
        //     updatedAt: new Date(user.updatedAt).toLocaleString('en-US', {timeZone: 'Africa/Nairobi'})
        // };
        return {status: 'success', token, user}
      } else { return {status: 'failed',errors: ["401 Unauthorized", "invalid username or password"]}}}}

export {validateUser, validateLogin, errors}




