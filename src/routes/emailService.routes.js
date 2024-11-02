import { Router } from "express";
import {
    sendEmail
} from "../controllers/emailController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()
router.route("/send").post(verifyJWT, sendEmail)

export default router
