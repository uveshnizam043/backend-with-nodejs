import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken,
    verifyToken,
    verifyUser
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT}  from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(registerUser)

// router.route("/register").post(
//     upload.fields([
//         {
//             name: "avatar",
//             maxCount: 1
//         }, 
//         {
//             name: "coverImage",
//             maxCount: 1
//         }
//     ]),
//     registerUser
//     )

router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/self").get(verifyJWT,  verifyToken)
router.route("/verify/:token").get(verifyUser)
router.route("/refresh-access-token").post(refreshAccessToken)


export default router
