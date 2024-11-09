import { Router } from "express";
import { 
   createDocument,
   getDocuments,
   getDocument,
   createShareLink,
   AccessLink
} from "../controllers/document.controller.js";
import {verifyJWT}  from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create").post(verifyJWT,createDocument)
router.route("/get").get(verifyJWT,getDocuments)
router.route("/get/:id").get(getDocument)
router.route("/create-link").post(verifyJWT,createShareLink)
router.route("/verify-link/:token").get(verifyJWT,AccessLink )



export default router
