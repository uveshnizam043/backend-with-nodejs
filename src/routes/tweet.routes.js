import { Router } from "express";
import { 
    postTweet,getTweets,getTweet,updateLikes,createReplyTweet,bookmarkPost,repostTweet,postQuoteTweet,scheduleTweet,postPollTweet,updatePollTweet
} from "../controllers/tweet.controller.js";
import {verifyJWT}  from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/post-tweet").post(verifyJWT,  postTweet)
router.route("/post-schedule-tweet").post(verifyJWT,  scheduleTweet)
router.route("/post-poll-tweet-choice").post(verifyJWT,  updatePollTweet)
router.route("/post-quote-tweet").post(verifyJWT,  postQuoteTweet)
router.route("/post-poll-tweet").post(verifyJWT,  postPollTweet)
router.route("/get-tweet").get(getTweets)
router.route("/tweet/:id").get(getTweet)
router.route("/update-tweet").post(verifyJWT,updateLikes)
router.route("/reply-tweet").post(verifyJWT,createReplyTweet)
router.route("/add-bookmark").post(verifyJWT,bookmarkPost)
router.route("/re-post").post(verifyJWT,repostTweet)



export default router
