import mongoose from "mongoose";
import { logger } from "./logger";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    logger.info("Successfully connected to MongoDB ✅");
  } catch (err: any) {
    logger.error(`Error while connecting db : ${err.message}`);
    process.exit(1);
  }
};
