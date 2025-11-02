import mongoose from "mongoose";
import Joi from "joi";

// ------------------
// Mongoose Schema
// ------------------
const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    default: null
  }
});

export const validateUser = (data) => {
  const schema = Joi.object({
    fullname: Joi.string().trim().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    })
  });

  return schema.validate(data);
};

const User = mongoose.model("User", userSchema);
export default User;
