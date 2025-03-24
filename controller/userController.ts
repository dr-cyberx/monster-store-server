import bcrypt from "bcryptjs";
import { logger } from "../config/logger";
import asyncHandler from "../middleware/asyncHandler";
import user from "../models/userModel";
import generateToken from "../utils/createToken";
import { iGetAllUserQuery } from "../types/controllerTypes";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  logger.info(JSON.stringify({ username, email, password }));

  if (!username || !email || !password) {
    throw new Error("Please provide all the details");
  }

  const isUserExist = await user.findOne({ email });
  if (isUserExist) res.status(400).send("User already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new user({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();

    generateToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      idAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  logger.info(JSON.stringify({ email, password }));

  const isExistingUser = await user.findOne({ email });

  if (isExistingUser) {
    const isValidPassword = await bcrypt.compare(
      password,
      isExistingUser.password
    );

    if (isValidPassword) {
      generateToken(res, isExistingUser._id);

      res.status(201).json({
        _id: isExistingUser._id,
        username: isExistingUser.username,
        email: isExistingUser.email,
        idAdmin: isExistingUser.isAdmin,
      });
      return;
    }
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Log out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const { _id, email, username, isAdmin } = req.query;

    let filter: iGetAllUserQuery = {};

    if (_id) filter._id = _id as string;
    if (email) filter.email = email as string;
    if (username) filter.username = username as string;
    if (isAdmin) filter.isAdmin = Boolean(isAdmin);

    const users = await user.find(filter).select("-password");
    res.status(200).json(users);
  } catch (error) {
    logger.error(JSON.stringify(error));
    throw new Error("Something went wrong");
  }
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  try {
    const User = await user.findById((req as any).user._id);
    if (User) {
      res.status(200).json({
        _id: User._id,
        username: User.username,
        email: User.email,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  try {
    const User = await user.findById((req as any).user._id);
    if (User) {
      User.username = req.body.username || User.username;
      User.email = req.body.email || User.email;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        User.password = hashedPassword;
      }

      const updatedUser = await User.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const userToDelete = await user.findById(req.params.id);

  if (userToDelete) {
    if (userToDelete.isAdmin) {
      res.status(400);
      throw new Error("Admin cannot be deleted");
    }
    await userToDelete.deleteOne({ _id: userToDelete._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserByID = asyncHandler(async (req, res) => {
  const userToDelete = await user.findById(req.params.id).select("-password");

  if (userToDelete) {
    userToDelete.username = req.body.username || userToDelete.username;
    userToDelete.email = req.body.email || userToDelete.email;
    userToDelete.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await userToDelete.save();
    res.status(200).json({ userToDelete });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  updateUserByID,
};
// const createUser =
