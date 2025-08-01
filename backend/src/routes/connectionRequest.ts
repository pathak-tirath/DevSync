import express from "express";
import { CustomRequest, userAuth } from "../middlewares/auth";
import { connectionRequestModel } from "../models/connectionRequest";

export const connectionRequestRouter = express.Router();

//func To send a connection request
connectionRequestRouter.post(
  "/send/request/:status/:toUser",
  userAuth,
  async (req: CustomRequest, res) => {
    try {
      const user = req.userData; //From the database, attached from the userAuth middleware to  the req body
      
      const requestData = {
        fromUser: user && user._id,
        toUser: req.params.toUser,
        status: req.params.status

      }

      const newConnection = new connectionRequestModel(requestData)
      newConnection.save()
      
      res.status(200).json({
        message:`${user?.firstName} send you a connection request!`
      })

    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
);
