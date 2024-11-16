import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Document } from "../models/document.model.js"
import { Version } from "../models/version.model.js"
import { ShareLink } from "../models/ShareLink.model.js"
import crypto from 'crypto';
import redisConnection from '../config/redis-connection.js';
import DiffMatchPatch from 'diff-match-patch';

const dmp = new DiffMatchPatch();

function calculateDiff(oldContent, newContent) {
    const diff = dmp.diff_main(oldContent, newContent);
    dmp.diff_cleanupSemantic(diff);
    return diff;
}


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
    const documents = await Document.find({
        $or: [
            { ownerId: req.user._id },
            { collaborators: { $elemMatch: { userId: req.user._id } } }
        ]
    });
    return res.status(201).json(
        new ApiResponse(200, documents, "Documents get successfully")
    )

})

const getDocument = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log("req.params", req.params)
    console.log(" req.user", req.user)

    const document = await Document.findOne({
        _id: id,
        $or: [
            { ownerId: req.user._id },
            { collaborators: { $elemMatch: { userId: req.user._id } } }
        ]
    });
    console.log('document', document);
    // const document = await Document.findOne({ _id: id });
    return res.status(201).json(
        new ApiResponse(200, document, "Document get successfully")
    )

})
const createShareLink = asyncHandler(async (req, res) => {
    const { to, message, canEdit, document, title } = req.body;
    console.log("req.body",req.body);
    const findDocument = await Document.findById(document);
    if (!findDocument) return new ApiError(404, "document is not found");
    // if (!findDocument.title) {
    //     await Document.findOneAndUpdate(
    //         { _id: document._id },
    //         { $set: { title: title } },
    //         { new: true, runValidators: true }
    //     );
    // }
    if (findDocument.initialDocumentTitle) {
        findDocument.title = title;
        findDocument.initialDocumentTitle = false;
        await findDocument.save();
    }
    const token = crypto.randomBytes(16).toString('hex');
    await ShareLink.create({
        document,
        token,
        canEdit,
    });

    await redisConnection.lPush('documentInvitationQueue', JSON.stringify({ title, message, to, subject: 'Document is shared with you', token }));


    return res.status(201).json(
        new ApiResponse(201, "Invitation link has been send")
    )

    // const statusEmail = sendEmail1({ to, subject: 'Document is shared with you', token })
    // if (statusEmail) {
    //     return res.status(201).json(
    //         new ApiResponse(200, token, "Share Link is created")
    //     )
    // }



})

const AccessLink = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const user = req.user
    const documentShareLink = await ShareLink.findOne({ token }).populate("document")
    if (!documentShareLink) {
        throw new ApiError(404, "Invalid  or expired");
    }
    const newCollaborator = {
        userId: user._id,
        permission: 'editor',
    }
    const updatedDocument = await Document.findByIdAndUpdate(
        documentShareLink.document._id,
        { $push: { collaborators: newCollaborator } }, // Add new collaborator
        { new: true }                                  // Return updated document
    );
    await ShareLink.findByIdAndDelete(documentShareLink._id);
    return res.status(201).json(
        new ApiResponse(200, {
            document: updatedDocument
            // canEdit: documentShareLink.canEdit,
        }, "Share Link is created")
    )
    // } 

})

const saveDocument = asyncHandler(async (req, res) => {
    const { documentId, htmlContent } = req.body;

    const document = await Document.findById(documentId);
    if (document) {
        const diff = calculateDiff(document.content, htmlContent);
        // Save diff as a new version
        const newVersion = new Version({
            documentId,
            version: document.currentVersion + 1,
            diff,
        });
        await newVersion.save();

        // Update document with new version number and latest content
        document.currentVersion += 1;
        document.content = htmlContent;
        await document.save();
        return res.status(201).json(
            new ApiResponse(200, document, "Document get update")
        )
    } else {
        const newDocument = new Document({
            title: "uvesh title",
            _id: documentId,
            content: htmlContent,
            currentVersion: 1,
            ownerId: req.user._id
        });
        await newDocument.save();
        return res.status(200).json(
            new ApiResponse(200, document, "New Document created")
        )
    }

    // return res.status(201).json(
    //     new ApiResponse(200, documents, "Documents get successfully")
    // )

})
export { createDocument, getDocuments, getDocument, createShareLink, AccessLink, saveDocument } 