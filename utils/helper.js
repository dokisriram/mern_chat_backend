import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export const errorHandler = (err, req, res, next) => {
  console.log(err)
  res.status(500).json({
    success: false,
    message: err.message || "internal server error",
  });
};

export const validators = {
  loginSignupValid: [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").notEmpty().withMessage("Password Should Not be Empty"),
  ],
};

export const validationError = (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    const errors = validationResult(req).array();
    const error = errors[0].msg;
    return res.status(400).json({ success: false, message: error });
  }
  next();
};

export const isAuthenticated = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization;
    const token = bearer.split(" ")[1];
    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "Token required" });
    }

    const response = await jwt.decode(token, process.env.JWT_SECRET);
    req.user = response;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ success: false, message: "Token Expired" });
    }
    next(error);
  }
};

export const socketAuthentication = (socket, next) => {
  try {
    const token = socket.handshake.headers.token || socket.handshake.auth.token;
    if (!token) {
      throw new Error("Token required");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded._id;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new Error('invalid or expired token'))
    }
    next(error);
  }
};
