import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../types/user";

export interface CustomRequest extends Request {
  userData?: IUser
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

    // Verify token
    const extractedMessage = await jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    if (typeof extractedMessage === "object" && "_id" in extractedMessage) {
      const { _id } = extractedMessage;

      // Get the user from the DB.  
      const userData = await User.findById(_id);
      if (!userData) {
        res.status(404).json({ error: "User is not found!" });
        return;
      }
      // attaches the data from the database to the request handler and passes it on to the next function call
      req.userData = userData;
      next(); //To call the  middleware function, else request will keep hanging
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: "Something went wrong" });
  }
};
