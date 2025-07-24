import "dotenv/config";
import express from "express";
import { connectDB } from "./config/database";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  connectDB()
    .then(() => {
      console.log(`Server successfully listening on ${process.env.PORT}`);
    })
    .catch(() => {
      console.log("Something went wrong!");
    });
});
