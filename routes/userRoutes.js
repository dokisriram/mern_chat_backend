import { Router } from "express";
import { isAuthenticated, validationError, validators } from "../utils/helper.js";
import { userControllers } from "../controllers/userController.js";

const router = Router();

router.post('/login', validators.loginSignupValid, validationError, userControllers.login)
router.post('/signup', validators.loginSignupValid, validationError, userControllers.signup)
router.get('/chats/:targetUser',isAuthenticated ,userControllers.getChats)
router.get('/users', isAuthenticated, userControllers.getAllUsers)

export default router;