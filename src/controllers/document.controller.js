import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Document } from "../models/document.model.js"
import { ShareLink } from "../models/ShareLink.model.js"
import { sendEmail1 } from "./emailController.js"
import { cacheDocument, getCachedDocument } from '../redis/documentCacheService.js'
import crypto from 'crypto';
import { publishDocumentUpdate } from '../redis/pubSubService.js'
// import Document from '../models/documentModel'
import mongoose  from "mongoose"
const createDocument = asyncHandler(async (req, res) => {
    console.log("createDocument");
    const { user } = req
    const { title, content, ownerId, permission } = req.body;
    console.log("user", user)
    // const docId = new mongoose.Types.ObjectId();  // Generating unique docId
    try {
        const newDocument = new Document({
            title,
            content,
            ownerId,
            collaborators: [
                {
                    userId: user._id,
                    permission: 'owner',
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
    console.log("req", req.user);
    const documents = await Document.find({ ownerId: req.user._id });
    return res.status(201).json(
        new ApiResponse(200, documents, "Documents get successfully")
    )

})

const getDocument = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log("req.params", req.params)
    const document = await Document.findOne({ _id: id });
    return res.status(201).json(
        new ApiResponse(200, document, "Document get successfully")
    )

})
const createShareLink = asyncHandler(async (req, res) => {
    const { to, subject, canEdit, document } = req.body;
    try {

        const findDocument = await Document.findById(document);
        if (!findDocument) return new ApiError(404, "document is not found");

        // Generate a unique token
        const token = crypto.randomBytes(16).toString('hex');

        // Create a share link in the database
        await ShareLink.create({
            document,
            token,
            canEdit,
        });
        const statusEmail = sendEmail1({ to, subject: 'Document is shared with you', token })
        if (statusEmail) {
            return res.status(201).json(
                new ApiResponse(200, token, "Share Link is created")
            )
        }

    } catch (error) {
        console.log("error", error);

        throw new ApiError(500, "Error while creating link");

    }

})

const AccessLink = asyncHandler(async (req, res) => {
    const { token } = req.params;
    // try {
        const documentShareLink = await ShareLink.findOne({ token}).populate("document")
        if (!documentShareLink) {
            throw new ApiError(404, "Invalid  or expired");
        }
        const newCollaborator={
            userId:'670b8663d2ef881ed9677f2a',
            permission: 'editor',
        }
        const updatedDocument = await Document.findByIdAndUpdate(
            documentShareLink.document._id,
            { $push: { collaborators: newCollaborator } }, // Add new collaborator
            { new: true }                                  // Return updated document
          );
        return res.status(201).json(
            new ApiResponse(200, {
                document: updatedDocument
                // canEdit: documentShareLink.canEdit,
            }, "Share Link is created")
        )
    // } 

})

export { createDocument, getDocuments, getDocument, createShareLink, AccessLink } 