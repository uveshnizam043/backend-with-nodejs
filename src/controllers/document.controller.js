import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Document } from "../models/document.model.js"
import { cacheDocument, getCachedDocument } from '../redis/documentCacheService.js'
import { publishDocumentUpdate } from '../redis/pubSubService.js'
// import Document from '../models/documentModel'

const createDocument = asyncHandler(async (req, res) => {
    const {user}=req
    const { title,content ,ownerId,permission} = req.body;
    console.log("content",content )
    // const docId = new mongoose.Types.ObjectId();  // Generating unique docId
  try{
    const newDocument = new Document({
        title,
        content,
        ownerId,
        collaborators: [
            {
              userId: user._id,
              permission: permission,
            },
          ],
    });

    await newDocument.save();
    return res.status(201).json(
        new ApiResponse(200, newDocument, "document is create Successfully")
    )
    } catch (error) {
        console.log("error while creating documents", error)
        // Check for duplicate key error (MongoDB error code 11000)
        if (error.code === 11000) {
            throw new ApiError(409, "Email already exists");
        } else {
            throw new ApiError(500, "An error occurred during user registration");
        }
    }

})
const getDocuments = asyncHandler(async (req, res) => {
    console.log("req",req.user);
    const documents = await Document.find({ ownerId: req.user._id});
    return res.status(201).json(
        new ApiResponse(200, documents, "Documents get successfully")
    )

})

const getDocument = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log("req.params",req.params)
    const document = await Document.findOne({ _id: id });
    return res.status(201).json(
        new ApiResponse(200, document, "Document get successfully")
    )

})


export { createDocument,getDocuments,getDocument } 