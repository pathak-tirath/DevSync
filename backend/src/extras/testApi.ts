// // To get a Specific user
// app.get("/user", async (req, res) => {
//   try {
//     const userEmail = req.body.email;
//     const user = await User.find({ email: userEmail });
//     if (user.length > 0) {
//       res.status(200).json(user);
//     } else {
//       res.status(404).json({ message: "No Users Found!" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

// // Get list of all users
// app.get("/feed", async (req, res) => {
//   try {
//     const getAllUsers = await User.find({});
//     res.status(200).json(getAllUsers);
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });



// // To Delete a user
// app.delete("/user/:id", async (req, res) => {
//   try {
//     const userId = req.params.id;

//     const deleteUser = await User.findByIdAndDelete(userId);
//     if (deleteUser) {
//       res.status(200).json({ message: "User has been deleted successfully" });
//     } else {
//       res.status(404).json({ message: "Requested User is  not found!" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

// // To update a user
// app.patch("/user/:id", async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const userData = req.body;
//     const ALLOWED_UPDATES = ["photoUrl", "about", "skills"];
//     const isAllowedUpdate = Object.keys(userData).every((key) =>
//       ALLOWED_UPDATES.includes(key)
//     );
//     // remove duplicate skills value
//     if (userData.skills.length > 1) {
//       const unique_skills = new Set(userData.skills); //Get only the unique values and removes the duplicated values
//       userData.skills = [...unique_skills]; //Replace the skill objects with the latest unique skills array
//     }
//     if (!isAllowedUpdate) {
//       throw new Error("Update is not allowed");
//     }

//     const updateUser = await User.findByIdAndUpdate(userId, userData, {
//       runValidators: true,
//     });
//     if (updateUser) {
//       res.status(200).json({ message: "User has been updated successfully!" });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     if (error instanceof mongoose.Error.ValidationError) {
//       res.status(400).json({ message: error.message });
//     } else {
//       if (error instanceof Error) {
//         res.status(500).json({ message: error.message });
//       }
//     }
//   }
// });
