import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    }

});

const User = mongoose.model("User", userSchema);
export default User;
