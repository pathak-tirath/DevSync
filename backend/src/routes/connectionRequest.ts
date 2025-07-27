import express from "express";
import { CustomRequest, userAuth } from "../middlewares/auth";

export const connectionRequestRouter = express.Router();

//func To send a connection request
connectionRequestRouter.post(
  "/sendConnectionRequest",
  userAuth,
  async (req: CustomRequest, res) => {
    try {
      const user = await req.userData;
      console.log("afterwards")
      res.send(`${user && user.firstName} sent you a connection request!`);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  }
);
