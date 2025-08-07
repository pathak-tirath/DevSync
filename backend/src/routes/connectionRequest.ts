import express from "express";
import { CustomRequest, userAuth } from "../middlewares/auth";
import { connectionRequest } from "../models/connectionRequest";
import { User } from "../models/user";

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

      //*  Another way for checking if user sends connection request to himself/herself
      // const sameUser = await User.findOne({
      //   _id: requestData.toUser,
      // });

      // if (sameUser?._id.toString() == requestData.fromUser?.toString()) {
      //   res.status(400).json({ message: "Cannot send request to yourself" });
      //   return;
      // }

      //  Check if the user exists in the DB
      const toUser = await User.findById(requestData.toUser);
      if (!toUser) {
        res.status(400).json({ message: "User dosen't exist" });
        return;
      }

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
      const newConnection = new connectionRequest(requestData);
      await newConnection.save();

      res.status(200).json({
        message: `${user?.firstName} ${requestData?.status} ${toUser.firstName}`,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
);

// ? Normalize approach
// connectionRequestRouter.post(
//   "/send/request/:status/:toUser",
//   userAuth,
//   async (req: CustomRequest, res) => {
//     try {
//       const user = req.userData; // From the database, attached from the userAuth middleware

//       let requestData = {
//         fromUser: user && user._id,
//         toUser: req.params.toUser,
//         status: req.params.status,
//       };

//       // Validation to not allow status other than like and pass
//       const allowedStatus = ["like", "pass"];
//       if (!allowedStatus.includes(requestData.status)) {
//         res
//           .status(400)
//           .json({ message: `${requestData.status} is invalid status type` });
//         return;
//       }

// // Normalize fromUser and toUser order for consistent storage - basically swaps the fromUser and toUser
//       if (requestData.fromUser!.toString() > requestData.toUser!.toString()) {
//         [requestData.fromUser as unknown as string, requestData.toUser! as unknown] = [
//           requestData.toUser,
//           requestData.fromUser,
//         ];
//       }

//       // Check for existing connection with normalized pair
//       const existingConnectionRequest = await connectionRequest.findOne({
//         fromUser: requestData.fromUser,
//         toUser: requestData.toUser,
//       });

//       if (existingConnectionRequest) {
//         res.status(400).json({
//           message: "Connection request already exists between these users",
//         });
//         return;
//       }

//       // Create and save the new connection
//       const newConnection = new connectionRequest(requestData);
//       await newConnection.save();

//       res.status(200).json({
//         message: `${user?.firstName} sent you a connection request!`,
//       });
//     } catch (error) {
//       if (error instanceof Error) {
//         res.status(400).json({ message: error.message });
//       }
//     }
//   }
// );
