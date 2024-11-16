import mongoose from "mongoose"
import { type } from "os";


// const ChangeSchema = new mongoose.Schema({
//   timestamp: { type: Date, default: Date.now },
//   userId: { type: String, required: true },  
//   changes: { type: String, required: true }, 
// });



const DocumentSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String, required: false },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentVersion: { type: Number, default: 1 },
  initialDocumentTitle: {
    type: Boolean,
    default: true
  },
  collaborators: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      permission: {
        type: String,
        enum: ["read", "write", 'owner', 'editor'],
        required: true,
      },
    },
  ],
});

export const Document = mongoose.model("Document", DocumentSchema)

