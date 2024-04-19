import mongoose,{Schema} from "mongoose";
const bookmarkSchema = new mongoose.Schema({
    tweetId: {
          type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
        required: true
    },
    userId: {
          type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
export const Bookmark = mongoose.model("bookmark", bookmarkSchema)