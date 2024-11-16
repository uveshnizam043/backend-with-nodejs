import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
// import { emailQueue } from '../config/emailQueue.js';
import redisConnection from '../config/redis-connection.js';


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    console.log("reqbody", req.body)
    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }




    // Create the user
    let user;
    try {
        user = await User.create({
            username,
            email,
            password,
        });

        // await emailQueue.add('sendVerificationEmail', {

        //   });
        const queueData = {
            email: user.email,
            username: user.username,
            verificationToken: user._id,
        }
        await redisConnection.lPush('userVerifyEmail', JSON.stringify(queueData));
        return res.status(201).json(
            new ApiResponse(201, user, "Invitation link has been send")
        );
    } catch (error) {
        console.log(" email, password", email, password)
        console.log("error", error)
        // Check for duplicate key error (MongoDB error code 11000)
        if (error.code === 11000) {
            throw new ApiError(409, "Email already exists");
        } else {
            throw new ApiError(500, "An error occurred during user registration");
        }
    }

    // Fetch and prepare the user object for response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Respond with the created user object
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});
const verifyUser = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({ _id: token });

    if (!user || user.status == "verified") {
        throw new ApiError(404, "Invalid Link");
    }
    const updateUser = await User.findOneAndUpdate(
        { _id: token },
        { $set: { status: 'verified' } },
        { new: true, runValidators: true }
    );
    return res.status(200).json(
        new ApiResponse(200, updateUser, "Invitation link has been send")
    );
});

const verifyToken = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user: req.user
                },
                "Token Verify"
            )
        )
})
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email) {
        throw new ApiError(400, "username or email is required")
    }
    const user = await User.findOne({ $or: [{ email }] })
    if (!user) {
        throw new ApiError(400, "user not exist")
    }
    if (user.status === "unverified") {
        throw new ApiError(403, "Please confirm your  email first")
    }


    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid user")

    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id)
    const loggedUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true,
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
})

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")

    }

}
const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    }, {
        new: true
    })
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User logged out successfully"))
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")

        }

        if (user?.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }
        const options = {
            httpOnly: true,
            secure: true,
        }
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        const updatedUser = await User.findByIdAndUpdate(user?._id, { refreshToken: newRefreshToken }, { new: true });
        if (!updatedUser) {
            throw new Error("User not found");
        }
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken, refreshToken: updatedUser.refreshToken, user
                    },
                    "refresh token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "unauthorized request")
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(401, error?.message || "unauthorized request")
    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

})
const getCurrentUser = asyncHandler(async (req, use) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user: req.user
                },
                "refresh token refreshed"
            )
        )
})

const updateAccountDetails = asyncHandler(async (req, use) => {

    const { fullName, email } = req.body
    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullName,
            email
        }
    }, { new: true }).select("-password")
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Account Is updated"
            )
        )
})

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar File is missing")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "Error while Uploading on avatar")
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: avatar.url
        }
    }, { new: true }).select("-password")
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Update Successful"
            )
        )
})


const updateAvatarCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Avatar File is missing")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "Error while Uploading on avatar")
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: coverImage.url
        }
    }, { new: true }).select("-password")
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Cover Image Update Successful"
            )
        )
})
export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateAvatar, updateAvatarCoverImage, verifyToken, verifyUser } 