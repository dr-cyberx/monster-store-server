import express from "express";
import {
  createUser,
  getAllUsers,
  getCurrentUserProfile,
  loginUser,
  logoutCurrentUser,
  updateCurrentUserProfile,
} from "../controller/userController";
import { authenticate, authorizedAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizedAdmin, getAllUsers);

router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

export default router;
