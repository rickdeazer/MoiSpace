import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  gallaryLinks: {
    type: String
  },
  profileLink: {
    type: String
  },
  aboutMe: {
    type: String
  },
  aboutYou: {
    type: String
  },
  course: {
    type: String
  },
  year: {
    type: String
  },
  slogan: {
    type: String
  }
}, 
{ timestamps: true });


const messageL= new mongoose.Schema({
        from: String,
        to: String,
        text: String,
        time: String,
        read: {type: Boolean, default: false}
})

const Messages= mongoose.model("Messages", messageL)

const userModel = mongoose.model("Users", userSchema);


export {userModel, Messages}