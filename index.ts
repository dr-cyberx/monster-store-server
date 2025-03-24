import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db";
import userRoutes from "./routes/usersRoutes";
import { logger } from "./config/logger";
import requestLogger from "./middleware/loggerMiddleware";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger); // Attach logger middleware

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use("/api/users", userRoutes);

app.listen(process.env.PORT, () => {
  logger.info(`Server is running on port ${port} 🚀`);
});
