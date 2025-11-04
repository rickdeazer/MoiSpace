import {userModel} from "../models/models.js";
import jwt from "jsonwebtoken";
const issueData = async (req,res,next)=>{
    try {
        const userData = await userModel.find().select('-password -createdAt');
        res.json({status: 'success', userData});  // send data to frontend
        next()
    } catch(err){
        console.error(err);
        res.json({status: 'failed', error: "Server error", statusCode: 500 });
        res.send(" 501; error")
    }
}

const giveMainUser = async (req,res,next)=>{
    const token = req.cookies.token
    if (!token){
        console.log("we found no token")
    } else {
        try {
            const user = jwt.verify(token,process.env.JWT_SECRET)            
            return res.status(200).json({userDetails: user})
        } catch (error) {
            return res.status(401).json({error: "an error loading your details"})
        }
    }
}
export { issueData,giveMainUser };
