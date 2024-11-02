import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Tweet } from "../models/tweet.model.js"
import { PollTweet } from "../models/pollTweet.model.js"
import { ReplyTweet } from "../models/replyTweet.model.js"
// import { PostLike } from "../models/tweetLike.model.js"
import { Bookmark } from "../models/bookmark.model.js"
import { User } from "../models/user.model.js"
// import mongoose,{Schema,ObjectId} from "mongoose";
import cron from "node-cron"


const postTweet = asyncHandler(async (req, res) => {
    const { content, author, user } = req.body
    if (
        [content, author, user].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    const newTweet = await Tweet.create({
        content, author, user
    })
    return res.status(201).json(
        new ApiResponse(200, newTweet, "tweet is post Successfully")
    )

})

const speechToText = asyncHandler(async (req, res) => {


})

export { speechToText} 