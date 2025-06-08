import express from "express";
import { connectDB } from "./config/database";
import "dotenv/config";
import { User } from "./models/user";

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    console.log("Failed to save to the database");
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
