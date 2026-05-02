import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * 0. Get user details from front end
 * 1. Validate request data - not empty
 * 2. If validation fails, return error
 * 3. Check if user already exists: username, email
 * 4. Check for images, check for avatar(required field)
 * 5. Upload images to cloudinary, avatar
 * 6. Create user object - create entry in db
 * 7. Remove password and refresh token field from response
 * 8. Check for user creation success or not
 * n. Return the response
 */
const registerUser = asyncHandler(async (req, res) => {
  // get request details - req.body or req.param or req.files
  const { fullName, email, username, password } = req.body;

  // validate
  // if (fullName === "") {
  //   throw new ApiError(400, "Full name is required");
  // }
  if (
    [fullName, email, username, password].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(
      400,
      "fullName, email, username and password is required"
    );
  }

  // check if user exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User is already existing");
  }

  // check for images
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image file is required");
  }

  if (
    req.files &&
    Array.isArray(req.files) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // upload images to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar image file is required");
  }

  // create user object
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!userCreated) {
    throw new ApiError(500, "Something went wrong while registering user!");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, userCreated, "User registered successfully"));
});

export { registerUser };
