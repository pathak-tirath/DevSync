import express from 'express'
import { CustomRequest, userAuth } from '../middlewares/auth';

export const profileRouter = express.Router()


//func To get user's profile
profileRouter.get("/profile", userAuth, async (req: CustomRequest, res) => { // Here, it checks the middleware - userAuth, if all good, then proceeds with the below function.
  try {
    const getUserProfile = await req.userData;
    res.status(200).json(getUserProfile);
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    }
  }
});

