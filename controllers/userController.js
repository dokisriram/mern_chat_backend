import User from "../models/User.js";
import bcrypt from "bcrypt";
import { json } from "express";
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";

export const userControllers = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).lean();
      if (!user) {
        throw new Error("User Not Found");
      }
      const isPwdTrue = await bcrypt.compare(password, user.password);
      if (!isPwdTrue) {
        throw new Error("Wrong Password");
      }
      delete user.password
      const token = await jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.status(200).json({
        success: true,
        message: "Signin Successfully",
        token,
        user
      });
    } catch (error) {
      next(error);
    }
  },
  signup: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const exists = await User.exists({ email: email });
      if (exists) {
        throw new Error("User Exists with Email");
      }
      const hashedPassword = await bcrypt.hash(password,parseInt(process.env.SALT_ROUNDS, 10));
      const newUser = await User.create({
        email,
        password: hashedPassword,
      });
      console.log(newUser);
      res.status(201).json({
        success: true,
        message: "User Signup Successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  getChats: async (req, res, next) => {
    try {
        const targetUserId = req.params.targetUser;
        const userId = req.user._id;
        const messages = await Message.find({
            $or: [
                {sender: targetUserId, receiver: userId},
                {sender: userId, receiver: targetUserId},   
            ]
        })
        res.status(200).json({
            success:true,
            messages
        })
    } catch (error) {
        next(error)
    }
  },
  getAllUsers: async(req, res, next) => {
    try {
      const currentUser = req.user._id;

      const allUsers = await User.find({ _id: {$ne: currentUser} });
      res.status(200).json({
        success:true,
        users: allUsers
      })
    } catch (error) {
      next(error)
    }
  }
};
