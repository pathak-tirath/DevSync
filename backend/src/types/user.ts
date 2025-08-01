import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  save(): unknown;
  firstName: string;
  lastName?: string;
  age?: number;
  email: string;
  password: string;
  gender?: "male" | "female" | "others";
  photoUrl?: string;
  about?: string;
  skills?: string[];
  getJWT?:() => void;
  validatePassword? :(password:string) => void;
}
