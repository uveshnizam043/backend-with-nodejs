// Define like schema
import mongoose from "mongoose";
const likeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    // This unique constraint ensures each user can like a post only once
  }, { unique: true });



  export const PostLike = mongoose.model("PostLike", likeSchema)