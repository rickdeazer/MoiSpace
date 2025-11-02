import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
username:
           {type: String,
           required: true,
           trim: true,
           unique: true },
password:
        {type: String,
        required: true,
        trim: true},
phone:
     {type: String,
     required: true,
     trim: true},

}, {timestamps: true});

const userModel = mongoose.model("Users", userSchema);


export default userModel;