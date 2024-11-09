import mongoose from 'mongoose';

const ShareLinkSchema = new mongoose.Schema({
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  token: { type: String, required: true, unique: true },
  canEdit: { type: Boolean, default: false },
  expiration: { type: Date, default: null }, // Optional expiration date
}, { timestamps: true });

export const ShareLink = mongoose.model("ShareLink", ShareLinkSchema)
