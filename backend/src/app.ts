import express from "express";
import { connnectDB } from "./config/database";

const app = express();

app.listen(3000, () => {
  connnectDB()
    .then(() => {
      console.log("Connection has been successful!");
    })
    .catch(() => {
      console.log("Something went wrong!");
    });
});
