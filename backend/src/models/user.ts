import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  password: String,
  gender: String,
});


export const User = mongoose.model('user',userSchema)

 