import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    maxlength: 280 // Maximum length for a poll question
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  choices: [{
    choice: String,
    choicePercentage: {
        type: Number,
        default: 0
    }
}],
 
}, {
  timestamps: true
});


export const PollTweet = mongoose.model("pollTweet", pollSchema)