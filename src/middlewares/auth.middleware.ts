import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IAuthRequest } from "../interfaces/request.interface";
import { sendError } from "../utils/ApiResponse";

export const authMiddleware = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return sendError(res, "Unauthorized", "No token provided", 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, "Unauthorized", "Invalid token", 401);
  }
};
