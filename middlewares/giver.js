import userModel from "../models/models.js";
import { localUser } from "../models/validation.js";
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
    const User = await localUser()
    return res.json(User.user)
}
export { issueData,giveMainUser };
