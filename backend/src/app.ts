import bcrypt from "bcrypt";
import "dotenv/config";
import express from "express";
import { connectDB } from "./config/database";
import { User } from "./models/user";
import { validateSignUp } from "./utils/validation";
import cookieParser from "cookie-parser";
import { CustomRequest, userAuth } from "./middlewares/auth";

const app = express();

app.use(express.json());
app.use(cookieParser());

// To add a user
app.post("/signup", async (req, res) => {
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

// Sign-in user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    validateSignUp(req);

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User is not found!");
    }
    const isPasswordMatch = await user && user.isPasswordValid && user.isPasswordValid(password);
    if (isPasswordMatch) {
      // Cookie
      const token = user.getJWT && await user.getJWT()
      
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

// To get user's profile

app.get("/profile", userAuth, async (req: CustomRequest, res) => { // Here, it checks the middleware - userAuth, if all good, then proceeds with the below function.
  try {
    const getUserProfile = await req.userData;
    res.status(200).json(getUserProfile);
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    }
  }
});

// To send a connection request
app.post("/sendConnectionRequest", userAuth, async (req: CustomRequest, res) => {
  try {
    const user = await req.userData;
    res.send(`${user && user.firstName} sent you a connection request!`)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
})

app.listen(3000, () => {
  connectDB()
    .then(() => {
      console.log(`Server successfully listening on ${process.env.PORT}`);
    })
    .catch(() => {
      console.log("Something went wrong!");
    });
});
