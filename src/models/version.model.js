import mongoose from "mongoose";

const versionSchema = new mongoose.Schema({
    documentId: mongoose.Schema.Types.ObjectId,
    version: Number,
    diff: Array,
    timestamp: { type: Date, default: Date.now },
  });

export const Version = mongoose.model("version", versionSchema)
