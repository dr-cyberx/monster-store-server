import { logger } from "../config/logger";
import asyncHandler from "./asyncHandler";

const requestLogger = asyncHandler(async (req, res, next) => {
  const startTime = Date.now();

  // Capture the original send function
  const originalSend = res.json.bind(res);

  res.json = (body: any) => {
    const responseTime = Date.now() - startTime;

    // Log request and response details
    logger.info(
      JSON.stringify({
        method: req.method,
        url: req.originalUrl,
        queryParams: req.query,
        requestBody: req.body,
        responseStatus: res.statusCode,
        responseBody: body,
        responseTime: `${responseTime}ms`,
      })
    );

    return originalSend(body); // ✅ Ensures the response is sent correctly
  };

  next();
});

export default requestLogger;
