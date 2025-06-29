import express, { Response } from "express";
import { connectDB } from "./config/database";
import "dotenv/config";
import { User } from "./models/user";

const app = express();

app.use(express.json());

// To add a user 
app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(200).json({ message: "User added successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    }
  }
});

// Get Specific user
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await User.find({ email: userEmail });
    if (user.length > 0) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "No Users Found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get all users
app.get("/feed", async (req, res) => {
  try {
    const getAllUsers = await User.find({});
    console.log(getAllUsers, "all");
    res.status(200).json(getAllUsers);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// To Delete a user
app.delete("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const deleteUser = await User.findByIdAndDelete(userId);
    if (deleteUser) {
      res.status(200).json({ message: "User has been deleted successfully" });
    } else {
      res.status(404).json({ message: "Requested User is  not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// To update a user
app.patch("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id
    const updateUser = await User.findByIdAndUpdate(userId, req.body, {
      runValidators: true
    })
    if (updateUser) {
      res.status(200).json({ message: "User has been updated successfully!" })
    } else {
      res.status(404).json({ message: "Failed to update the user" });

    }

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
