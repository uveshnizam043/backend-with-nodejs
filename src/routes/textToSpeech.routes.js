import { Router } from "express";
import { 
   speechToText
} from "../controllers/textToSpeech.controller.js";
// import {verifyJWT}  from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/speech-to-text").post( speechToText)



export default router