import { Request, Response, NextFunction } from "express";

type fn = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler =
  (fn: fn) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error: any) => {
      res.status(500).send({ message: error.message });
    });
  };

export default asyncHandler;
