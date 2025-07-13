import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { NextFunction, Request, Response } from "express";

export interface CustomRequest extends Request{
    userData?: unknown
}

export const userAuth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      res.status(403).json({ error: "Token Invalid! Please login in" });
      return;
    }
    const extractedMessage = await jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    if (typeof extractedMessage === "object" && "_id" in extractedMessage) {
      const { _id } = extractedMessage;
      const userData = await User.findById(_id);
      if (!userData) {
        res.status(404).json({ error: "User is not found!" });
        return;
      }
      req.userData = userData; // attaches the data from the database to the request handler and passes it on to the next function call
      next();
    }
  } catch (error) {
    res.status(400).json({ error: "Something went wrong" });
  }
};
