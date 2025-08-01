import express from "express";
import bcrypt from "bcrypt";
import { CustomRequest, userAuth } from "../middlewares/auth";
import {
  validateChangePassword,
  validateEditProfile,
} from "../utils/validation";

export const profileRouter = express.Router();

//func: To get user's profile of the logged in user
profileRouter.get("/profile", userAuth, async (req: CustomRequest, res) => {
  // Here, it checks the middleware - userAuth, if all good, then proceeds with the below function.
  try {
    const getUserProfile = await req.userData;
    res.status(200).json(getUserProfile);
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    }
  }
});

// func: To edit user's profile
profileRouter.patch("/profile", userAuth, async (req: CustomRequest, res) => {
  try {
    if (!validateEditProfile(req)) {
      res.status(400).json({ message: "Invalid update method call" });
    }
    const usersProfile = await req.userData;

    if (usersProfile) {
      Object.assign(usersProfile, req.body);
      if (usersProfile.skills) {
        usersProfile.skills = [...new Set(usersProfile.skills)];
      }
    }

    usersProfile && usersProfile.save(); // To save to the database

    res.send("Updated successfully");
  } catch (error) {
    if (error instanceof Error)
      res.status(401).json({ message: error.message });
  }
});

// func: To change user's password
profileRouter.patch(
  "/changePassword",
  userAuth,
  async (req: CustomRequest, res) => {
    try {
      const { password } = req.body;

      // checks for validations
      validateChangePassword(req);

      const userData = req.userData; //Get the user's data from the database

      const encryptedNewPassword = await bcrypt.hash(password, 10); //encrypt the new updated password
      if (userData) {
        userData.password = encryptedNewPassword;
        userData.save(); //Save the new encrypted password to the database

        res
          .status(200)
          .json({ message: "Password has been updated successfully" });
      } else {
        res.status(400).json({ message: "Sorry! Unable to update password" });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
);
