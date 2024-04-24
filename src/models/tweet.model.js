import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 280 // Maximum length for a tweet
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // choice for poll tweet
  choices: [{
    choice: String,
    choicePercentage: {
        type: Number,
        default: 0
    }
}],
  quoteTweetId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
    default: null,
    required: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isTweetRepost: {
    type: Boolean,
    default: false
  },
  //   retweets: {
  //     type: Number,
  //     default: 0
  //   },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReplyTweet'
  }],
  // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PostLike' }]
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bookmark: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bookmark"
    }
  ],
  // You can add other fields like hashtags, mentions, etc. based on your requirements
}, {
  timestamps: true
});


export const Tweet = mongoose.model("Tweet", tweetSchema)