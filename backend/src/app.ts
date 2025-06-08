import express from "express";
import { connectDB } from "./config/database";
import "dotenv/config";
import { User } from "./models/user";

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "john",
    lastName: "doe",
    age: 24,
    email: "john@doe.com",
    password: "john ",
    gender: "Male",
  });

  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    console.log("Failed to save to the database"  );
  }
});

app.listen(3000, () => {
  connectDB()
    .then(() => {
      console.log(`Server successfully listening on ${process.env.PORT}`);
    })
    .catch(() => {
      console.log("Something went wrong!");
    });
});
