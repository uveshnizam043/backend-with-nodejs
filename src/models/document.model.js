import mongoose from "mongoose"
// Change Schema: Tracks individual changes to the document
const ChangeSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  userId: { type: String, required: true },  // User making the change
  changes: { type: String, required: true },  // Description of the change (can store diff or full text)
});

// Document Schema: Tracks the entire document content and all changes
const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },  // Title of the document
  content: { type: String, required: false },  // Document's full content
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the owner (User)
  collaborators: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      permission: {
        type: String,
        enum: ["read", "write"],
        required: true,
      },
    },
  ],
});

// Exporting the document model
export const Document = mongoose.model("Document", DocumentSchema)

