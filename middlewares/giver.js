import {userModel, Messages} from "../models/models.js";
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

const obtainHistory= async (req,res)=>{
      let arr1 = await Messages.find({
    from: req.body.name2,
    to: req.body.name1,
  });
  let arr2 = await Messages.find({
    from: req.body.name1,
    to: req.body.name2,
  });
  res.json({ msgReceivedH: arr1, msgSentH: arr2 });
}
const markAsRead = async (req,res)=>{
      const { mainUser, receiver } = req.body;

await Messages.updateMany(
    { from: receiver, to: mainUser, read: false },
    { $set: { read: true } }
  );
 
}
export { issueData,giveMainUser,obtainHistory,markAsRead };
