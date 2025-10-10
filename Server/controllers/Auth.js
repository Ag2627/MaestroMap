import User, { validateUser } from "../models/User.js";
import { hashPassword,matchPassword } from "../utils/hashPassword.js";
import jwt from "jsonwebtoken";
import { generateVerificationToken, sendVerificationEmail } from "../utils/email.js";

// 🔹 Signup
export const signup = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ email });

    if (user) {
      // If user exists and is already verified, inform them
      if (user.isVerified) {
        return res.status(400).json({ message: "Email already exists and is verified. Please sign in." });
      } else {
        // If user exists but is not verified, resend verification email
        const verificationToken = generateVerificationToken();
        user.verificationToken = verificationToken;
        // Optionally, update other user details if needed, e.g., fullname or password
        // user.fullname = fullname;
        user.password = await hashPassword(password); // Update password if they are trying to sign up again with a new password
        await user.save();
        await sendVerificationEmail(email, user.fullname, verificationToken); // Use user.fullname from existing user

        return res.status(200).json({
          message: "User already exists but is not verified. A new verification email has been sent.",
          user: { id: user._id, fullname: user.fullname, email: user.email },
        });
      }
    }

    // If no existing user, create a new one
    const hashedPass = await hashPassword(password);
    const verificationToken = generateVerificationToken();

    user = await User.create({
      fullname,
      email,
      password: hashedPass,
      verificationToken,
    });

    await sendVerificationEmail(email, fullname, verificationToken);

    res.status(201).json({
      message: "User Registered Successfully. Please check your email to verify.",
      user: { id: user._id, fullname: user.fullname, email: user.email },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      let errorMessage = "Validation failed. Please check your inputs.";
      if (error.errors.password) {
        errorMessage = error.errors.password.message;
      }
      return res.status(400).json({ message: errorMessage });
    }
    next(error);
  }
};

// 🔹 Signin
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    if (!user.isVerified) {
      // Option 1: Just inform them
      return res.status(400).json({ message: "Please verify your email first" });
      // Option 2: Proactively resend verification email upon sign-in attempt if not verified
      // const verificationToken = generateVerificationToken();
      // user.verificationToken = verificationToken;
      // await user.save();
      // await sendVerificationEmail(email, user.fullname, verificationToken);
      // return res.status(400).json({ message: "Your email is not verified. A new verification email has been sent to your inbox." });
    }

    const token = jwt.sign(
      { userid: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Signin successful",
      token,
      user: { id: user._id, fullname: user.fullname, email: user.email }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully." });

  } catch (error) {
    next(error);
  }
};