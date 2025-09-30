import User from "../models/User.js"
import { hashPassword } from "../utils/hashPassword.js"
export const signup = async(req,resizeBy,next)=>{
    try{
        const {fullname,email,password} =req.body;

        const existing = await User.findOne({email});
        if (existing){
            return resizeBy.status(400).json({
                message: "Email Already exists"
            })
        }
        const hashedPass= await hashPassword(password);
        const user = await User.create({fullname,email,password:hashedPass});
        resizeBy.status(201).json({
            message: "User Registered Successfully",
            user: {id: user._id,fullname:user.fullname,email:user.email}
        });
    } catch(error){
        next(error);
    }
}