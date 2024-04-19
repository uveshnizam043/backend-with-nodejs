
import mongoose from "mongoose";
const replyTweetSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentTweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
        required: true
    },
    // Add other fields if needed
}, { timestamps: true });


export const ReplyTweet = mongoose.model("ReplyTweet", replyTweetSchema)