import User from "../models/User.js"
import { hashPassword, matchPassword } from "../utils/hashPassword.js"
import jwt from "jsonwebtoken"
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

export const signin = async(req,res,next)=>{
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({message:"Invalid email"});
        }

        const isMatch = await matchPassword(password,user.password);
        if (!isMatch){
            return res.status(400).json({message:"Invalid Password"});
        }

        const token = jwt.sign(
            {userid:user._id,email:user.email},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );
        res.status(200).json({
            message:"SIGNIN SUCESSFUL",
            token,
            user: {id:user._id,fullname:user.fullname,email:user.email}
        });
    }
    catch(error){
        next(error);
    }
}