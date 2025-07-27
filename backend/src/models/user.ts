import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


import { IUser } from "../types/user";

const { Schema } = mongoose;


const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, minLength: 4 },
    lastName: String,
    age: { type: Number, min: 18 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          return validator.isEmail(value);
        },
        message: "Please Enter a valid email id",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => {
          return validator.isStrongPassword(value);
        },
        message: "Please enter a strong password between 6 - 16 characters",
      },
    },
    gender: {
      type: String,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          const validGenders = ["male", "female", "others"];
          return validGenders.includes(value);
        },
        message: "Please enter a valid gender value (Male, Female, Others).",
      },
    },
    photoUrl: {
      type: String,
      validate: {
        validator: (value: string) => {
          return validator.isURL(value);
        },
        message: "Please enter a valid URL",
      },
    },
    about: { type: String, minLength: 10, default: "This is an About Section" },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

// Function to get the JWT token
userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
  return token
}


// To check if the password is valid or not
userSchema.methods.validatePassword = async function (password:string) {
   const isPasswordValid =  await bcrypt.compare(
        password,
        this?.password as string
      );

      return isPasswordValid
}



export const User = mongoose.model<IUser>("user", userSchema);
