import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db";
import { userRoutes } from "./routes/usersRoutes";
import { logger } from "./config/logger";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

logger.warn("This is a warning message");

// Simulating a successful DB connection
setTimeout(() => {
  logger.debug("❌ This is an error message");
}, 3000);

app.use("/api/users", () => {});

app.listen(process.env.PORT, () => {
  // console.log(`Server is running on port ${port} 🚀`);
  logger.info(`Server is running on port ${port} 🚀`);
});
