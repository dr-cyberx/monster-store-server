import express from "express";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getCurrentUserProfile,
  loginUser,
  logoutCurrentUser,
  updateCurrentUserProfile,
  updateUserByID,
} from "../controller/userController";
import { authenticate, authorizedAdmin } from "../middleware/authMiddleware";
import requestLogger from "../middleware/loggerMiddleware";

const router = express.Router();

// Apply logger middleware for all routes
// router.use(requestLogger);

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

// ADMIN ROUTES
router
  .route("/:id")
  .delete(authenticate, authorizedAdmin, deleteUserById)
  .put(authenticate, authorizedAdmin, updateUserByID);

export default router;
