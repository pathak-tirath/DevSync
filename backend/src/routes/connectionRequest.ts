import express from "express";
import { CustomRequest, userAuth } from "../middlewares/auth";
import { connectionRequest } from "../models/connectionRequest";

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
        status: req.params.status,
      };

      // Validation to not allow status other than like and pass
      const allowedStatus = ["like", "pass"];
      if (!allowedStatus.includes(requestData.status)) {
        res
          .status(400)
          .json({ message: `${requestData.status} is invalid status type` });
        return;
      }

      const newConnection = new connectionRequest(requestData);

      // Request validations
      const existingConnectionRequest = await connectionRequest.find({
        $or: [
          { fromUser: requestData.fromUser, toUser: requestData.toUser },
          { fromUser: requestData.toUser, toUser: requestData.fromUser },
        ],
      });

      if (existingConnectionRequest.length > 0) {
        res.status(400).json({
          message: "Request already exists",
        });
        return;
      }

      // Save to the database
      await newConnection.save();

      res.status(200).json({
        message: `${user?.firstName} send you a connection request!`,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
);
