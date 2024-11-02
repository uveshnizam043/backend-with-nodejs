import { Router } from "express";
import { 
   createDocument,
   getDocuments,
   getDocument
} from "../controllers/document.controller.js";
import {verifyJWT}  from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create").post(createDocument)
router.route("/get").get(verifyJWT,getDocuments)
router.route("/get/:id").get(getDocument)



export default router
