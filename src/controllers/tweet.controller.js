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

const postPollTweet = asyncHandler(async (req, res) => {
    console.log("req.body",req.body)
    const { question, choices, user } = req.body
    // if (
    //     [ question, choices, user].some((field) => field?.trim() === "")
    // ) {
    //     throw new ApiError(400, "All fields are required")
    // }
    const newPollTweet = await Tweet.create({
        content:question, choices, user , author:user
    })
    return res.status(201).json(
        new ApiResponse(200, newPollTweet, "new Poll tweet is post Successfully")
    )

})

const scheduleTweet = asyncHandler(async (req, res) => {
    try {
        console.log("req.boyd", req.body)
        const { minute, hour, day, month, content, author, user } = req.body

        const tr=`0 ${minute} ${hour} ${day} ${month} *`
        cron.schedule(tr, async () => { // This schedule runs at 10:00 AM every day
            console.log("welcome to india")
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
    } catch (error) {
console.log("error in schedule task",error)
    }
})

const repostTweet = asyncHandler(async (req, res) => {
    const { content, author, user } = req.body
    if (
        [content, author, user].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    const newTweet = await Tweet.create({
        content, author, user,
        isTweetRepost: true
    })
    return res.status(201).json(
        new ApiResponse(200, newTweet, "tweet is post Successfully")
    )

})
const getTweets = asyncHandler(async (req, res) => {
    const tweets = await Tweet.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author'
            }
        },
        {
            $unwind: '$author'
        },
        {
            $lookup: {
                from: 'replytweets',
                localField: 'replies',
                foreignField: '_id',
                as: 'replies'
            }
        },
        {
            $lookup: {
                from: 'tweets',
                let: { quoteTweetId: '$quoteTweetId' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$quoteTweetId'] }
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $unwind: { path: '$user', preserveNullAndEmptyArrays: true }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'author',
                            foreignField: '_id',
                            as: 'author'
                        }
                    },
                    {
                        $unwind: { path: '$author', preserveNullAndEmptyArrays: true }
                    },
                    {
                        $project: {
                            _id: 1,
                            content: 1,
                            user: {
                                _id: 1,
                                username: 1,
                                email: 1
                            },
                            author: {
                                _id: 1,
                                username: 1,
                                email: 1
                            }
                        }
                    }
                ],
                as: 'quoteTweetInfo'
            }
        },
        {
            $unwind: { path: '$quoteTweetInfo', preserveNullAndEmptyArrays: true }
        },
        {
            $lookup: {
                from: 'bookmarks',
                localField: 'bookmark',
                foreignField: '_id',
                as: 'bookmarkList'
            }
        },
        {
            $project: {
                content: 1,
                likes: 1,
                createdAt: 1,
                isTweetRepost: 1,
                user: {
                    _id: 1,
                    username: 1,
                    email: 1
                },
                author: {
                    _id: 1,
                    username: 1,
                    email: 1
                },
                quoteTweetInfo: {
                    _id: 1,
                    content: 1,
                    user: {
                        _id: 1,
                        username: 1,
                        email: 1
                    },
                    author: {
                        _id: 1,
                        username: 1,
                        email: 1
                    }
                },
                bookmarkList: {
                    _id: 1
                },
                replies: {
                    $map: {
                        input: '$replies',
                        as: 'reply',
                        in: {
                            _id: '$$reply._id',
                            content: '$$reply.content'
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                content: 1,
                likes: 1,
                createdAt: 1,
                isTweetRepost: 1,
                user: 1,
                author: 1,
                quoteTweetInfo: 1,
                bookmarkList: 1,
                replies: 1,
                poll: { $literal: null } // Adding a placeholder for poll field
            }
        },
        {
            $unionWith: {
                coll: 'polltweets',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $unwind: '$user'
                    },
                    {
                        $project: {
                            _id: 1,
                            question: 1,
                            choices: 1,
                            user: {
                                _id: '$user._id',
                                username: '$user.username',
                                email: '$user.email'
                            },
                            createdAt: 1,
                            updatedAt: 1
                        }
                    }
                ]
            }
        },
        {
            $sort: { createdAt: -1 } // Sort merged results by createdAt
        }
    ]);
    
    return res.status(200).json(
        new ApiResponse(200, tweets, "tweets successfully")
    )

})
const getTweet = asyncHandler(async (req, res) => {
    const tweetId = req.params.tweetId;
    console.log("tweetId", req);

    try {
        const tweet = await Tweet.findById(tweetId).populate('user') // Populate the 'user' field
            .populate('replies'); // Populate the 'replies' field, assuming it contains references to reply documents
        ; // Assuming you want to populate the 'user' field
        return res.status(200).json(
            new ApiResponse(200, tweet, "tweet successfully fetch")
        )
    } catch (error) {
        throw new ApiError(500, "Something went wrong tweet fetch")
    }
})
const updateLikes = asyncHandler(async (req, res) => {
    try {
        const { userId, tweetId } = req.body.tweetId;
        const tweet = await Tweet.findById(tweetId);
        console.log(" tweet.likes.", tweetId)

        const userLiked = tweet.likes.includes(userId);
        console.log("userLiked", userLiked);
        if (!userLiked) {
            const updatedTweet = await Tweet.findByIdAndUpdate(
                tweetId,
                { $push: { likes: userId } },
                { new: true }
            );

            return res.status(200).json(
                new ApiResponse(200, updatedTweet, "Reply is created successfully")
            );

        } else {
            const updatedTweet = await Tweet.findByIdAndUpdate(
                tweetId,
                { $pull: { likes: userId } },
                { new: true }
            );

            return res.status(200).json(
                new ApiResponse(200, updatedTweet, "Reply is created successfully")
            );
        }


    } catch (error) {
        console.error('Error updating tweet:', error);
        throw new ApiError(500, `Something went wrong while updating the tweet: ${error}`);
    }
});
const createReplyTweet = asyncHandler(async (req, res) => {
    try {
        const { content, parentTweetId } = req.body;
        const userId = req.user._id; // Assuming user ID is stored in req.user from authentication middleware
        // Save the new reply to the database
        const newReply = new ReplyTweet({
            content,
            user: userId,
            parentTweet: parentTweetId
        });

        const reply = await newReply.save();
        console.log('Reply saved successfully:', reply);

        // Once the reply is saved, push its ObjectId into the replies array of the corresponding tweet
        const updatedTweet = await Tweet.findByIdAndUpdate(
            parentTweetId,
            { $push: { replies: reply._id } },
            { new: true }
        );

        return res.status(200).json(
            new ApiResponse(200, updatedTweet, "Reply is created successfully")
        );
    } catch (error) {
        console.error('Error:', error);
        throw new ApiError(500, "Something went wrong")

    }
});
//Todo bookmark
const bookmarkPost = asyncHandler(async (req, res) => {
    try {
        const { tweetId } = req.body;
        const userId = req.user._id; // Assuming user ID is stored in req.user from authentication middleware
        // const { userId, tweetId } = req.body.tweetId;
        // const user = await User.findById(userId).populate('bookmark').exec()
        console.log("tweetId", tweetId)
        const userDocument = await User.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $lookup: {
                    from: 'bookmarks',
                    localField: 'bookmarks',
                    foreignField: '_id',
                    as: 'bookmarksList'
                }
            },
            {
                $unwind: '$bookmarksList'
            },
            {
                $group: {
                    _id: '$_id',
                    username: { $first: '$username' },
                    email: { $first: '$email' },
                    watchHistory: { $first: '$watchHistory' },
                    password: { $first: '$password' },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' },
                    __v: { $first: '$__v' },
                    refreshToken: { $first: '$refreshToken' },
                    bookmarksList: { $push: '$bookmarksList' }
                }
            }
        ]);

        //             const isTweetBookmarked = userDocument.bookmarksList.some(bookmark => bookmark.tweetId.toString() === tweetId);

        // console.log(isTweetBookmarked); // true or false
        console.log("userDocument", userDocument)
        return

        const bookmarkAlreadyInTweet = user.bookmarks.find((element) => {
            console.log(element, tweetId);
            return element == tweetId
        });
        console.log("bookmarkAlreadyInTweet", bookmarkAlreadyInTweet)
        if (!bookmarkAlreadyInTweet) {

            const bookmark = new Bookmark({
                tweetId,
                userId,
            });

            const createBookmark = await bookmark.save();

            const updatedTweet = await Tweet.findByIdAndUpdate(
                tweetId,
                { $push: { bookmark: createBookmark._id } },
                { new: true }
            );
            await User.findByIdAndUpdate(
                userId,
                { $push: { bookmarks: createBookmark._id } },
                { new: true }
            );
            return res.status(200).json(
                new ApiResponse(200, updatedTweet, "tweet is saved in bookmark")
            );

        }


    } catch (error) {
        console.error('Error:', error);
    }
})

const postQuoteTweet = asyncHandler(async (req, res) => {
    try {
        const { content, author, user, quoteTweetId } = req.body
        console.log(" content, author, user,quoteTweetId ", content, author, user, quoteTweetId)
        if (
            [content, author, user, quoteTweetId].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required")
        }
        const newTweet = await Tweet.create({
            content, author, user, quoteTweetId
        })
        return res.status(201).json(
            new ApiResponse(200, newTweet, "quote tweet is post Successfully")
        )
    } catch (error) {
        throw new ApiError(500, `Something went wrong while post quote the tweet: ${error}`);
    }
})
export { postTweet, getTweets, updateLikes, createReplyTweet, getTweet, bookmarkPost, repostTweet, postQuoteTweet, scheduleTweet,postPollTweet } 