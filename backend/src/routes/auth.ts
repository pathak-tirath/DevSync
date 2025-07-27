import express from "express";
import bcrypt from "bcrypt";

import { validateSignUp } from "../utils/validation";
import { User } from "../models/user";

export const authRouter = express.Router();


//func To add a user
authRouter.post("/signup", async (req, res) => {
  try {
    // To validate the user's data coming from UI or postman
    validateSignUp(req);

    const { firstName, lastName, email, password, age } = req.body;

    // Hash the password
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      age,
    };

    const user = new User(newUser);
    await user.save();
    res.status(200).json({ message: "User added successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
});


//func Sign-in user
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    validateSignUp(req);

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User is not found!");
    }
    const isPasswordMatch = await user?.validatePassword?.(password) || false;
        

    if (isPasswordMatch) {
      // Cookie
      const token = await user?.getJWT!()

      res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 3600000) });
      res.status(200).json({ message: "User logged in" });
    } else {
      res.status(400).json({
        message:
          "Either email or password entered are incorrect. Please try again",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
});


// func Logout
authRouter.post("/logout", (req, res) => {
  res.status(200).cookie("token", null, {
    expires: new Date(Date.now())
  }).json({ message: "Logout successfully" })
})