import jwt from "jsonwebtoken";
import user from "../models/userModel";
import asyncHandler from "./asyncHandler";
import { NextFunction, Request, Response } from "express";

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  //   read the jwt from 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as jwt.JwtPayload & { userId: string };
      (req as any).user = await user
        .findById(decoded.userId)
        .select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const authorizedAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user && (req as any).user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin");
  }
};

export { authenticate, authorizedAdmin };
