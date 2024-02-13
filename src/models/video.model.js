import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFIle: {
        type: String, //cloudinary url
        required: true
    },
    thumbnail: {
        type: String,//cloudinary url
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,//cloudinary url
        required: true
    },
    duration: {
        type: Number,//cloudinary url
        required: true
    },
    Views: {
        type: Number,//cloudinary url
        required: true
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    }
},
    {
        timestamps: true
    })

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema)