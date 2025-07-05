import mongoose from "mongoose";
import validator from 'validator'

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true, minLength: 4 },
  lastName: String,
  age: { type: Number, min: 18 },
  email: {
    type: String, required: true, unique: true, trim: true, lowercase: true, validate: {
      validator: (value: string) => {
        return validator.isEmail(value);
      },
      message:"Please Enter a valid email id"
    }
  },
  password: {
    type: String, required: true, validate: {
      validator: (value: string) => {
        var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        return regularExpression.test(value)
      },
      message: "Please enter a strong password between 6 - 16 characters"
    }
  },
  gender: {
    type: String, lowercase: true, validate: {
      validator: (value: string) => {
        const validGenders = ['male', 'female', 'others'];
        return validGenders.includes(value);
      },
      message: 'Please enter a valid gender value (Male, Female, Others).',
    }
  },
  photoUrl: { type: String, validate:{
    validator: (value:string) => {
      return validator.isURL(value)
    },
    message:"Please enter a valid URL"
  } },
  about: { type: String, minLength: 10, default: "This is an About Section" },
  skills: {
    type: [String]
  }

}, { timestamps: true });


export const User = mongoose.model('user', userSchema)

