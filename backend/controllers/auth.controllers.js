import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };
};

const sanitizeUser = (userDoc) => {
  const user = userDoc?.toObject ? userDoc.toObject() : { ...userDoc };
  delete user.password;
  delete user.resetOtp;
  delete user.isOtpVerified;
  delete user.otpExpires;
  return user;
};

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobileNumber, role } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }
    if (!mobileNumber || mobileNumber.toString().length !== 10) {
      return res
        .status(400)
        .json({ message: "Mobile number must be 10 digits" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      fullName,
      email,
      role,
      mobileNumber,
      password: hashedPassword,
    });

    const token = await genToken(user._id);
    res.cookie("token", token, getCookieOptions());
    return res.status(201).json(sanitizeUser(user));
  } catch (error) {
    return res.status(500).json(`sign up error ${error}`);
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User does not exists." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, getCookieOptions());

    return res.status(201).json({ user: sanitizeUser(user), token });
  } catch (error) {
    return res.status(500).json(`sign In error ${error}`);
  }
};

export const signOut = async (req, res) => {
  try {
    const cookieOptions = getCookieOptions();
    delete cookieOptions.maxAge;
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ message: "Signout successful" });
  } catch (error) {
    return res.status(500).json(`sign Out error ${error}`);
  }
};
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select(
      "+resetOtp +otpExpires +isOtpVerified",
    );
    if (!user) {
      return res.status(400).json({ message: "User does not exists." });
    }
    // generate otp
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    // 5 minutes from now
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    user.isOtpVerified = false;
    await user.save();

    // send otp to email
    await sendOtpMail(email, otp);
    return res.status(200).json({ message: "OTP sent succesfully." });
  } catch (error) {
    return res.status(500).json(`send Otp error ${error}`);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).select(
      "+resetOtp +otpExpires +isOtpVerified",
    );
    if (
      !user ||
      !user.resetOtp ||
      user.resetOtp !== otp ||
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired Otp." });
    }
    user.isOtpVerified = true;
    user.resetOtp = null;
    user.otpExpires = null;
    await user.save();
    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    return res.status(500).json(`verify Otp error ${error}`);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email }).select("+isOtpVerified");
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "Otp verification required." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    return res.status(500).json(`reset Password error ${error}`);
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, role } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName,
        email,
        mobileNumber,
        role,
      });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, getCookieOptions());
    return res.status(200).json(sanitizeUser(user));
  } catch (error) {
    return res.status(500).json(`google Auth error ${error}`);
  }
};
