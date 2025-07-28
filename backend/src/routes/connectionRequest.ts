import express from "express";
import { CustomRequest, userAuth } from "../middlewares/auth";

export const connectionRequestRouter = express.Router();

//func To send a connection request
connectionRequestRouter.post(
  "/send/request/:toUserId",
  userAuth,
  async (req: CustomRequest, res) => {
    try {
      const user = req.userData;
      res.send(user)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
);
