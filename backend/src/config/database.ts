import mongoose from "mongoose";
import "dotenv/config";

export const connnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected successfully to the database");
  } catch (err) {
    console.log(err);
  }
};
