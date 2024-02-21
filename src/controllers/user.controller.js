import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"
const registerUser = asyncHandler(async (req, res) => {
    //  get user details from frontend
    // validation -not empty

    // check if user already exist :username , 
    // check for images, check for avatar
    // upload them to cloudier, avatar
    // create use                                                                                                                                                                                                                                                                                                                                                                                                                                                               r object-create entry in db
    // remove password and refresh token field from response
    // check for user creation
    //return res
    const { fullName, email, username, password } = req.body
    if ([fullName, email, username, password].some((field) => field?.trim() === ""
    )) {
        throw new ApiError(400, "All field is required")
    }
    const existedUser = User.findOne({ $or: [{ username }, { email }] })
    res.status(200).json({
        message: "Ok"
    })
    if (existedUser) {
        throw new ApiError(409, "User is Existed")

    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.file?.coverImage[0]?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar does not exist")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath,)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath,)
    if (!avatar) {
        throw new ApiError(400, "Avatar file does not exist")
    }
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password,
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while register user")

    }
    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"))
})

export { registerUser }