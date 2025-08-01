import mongoose from "mongoose";

const { Schema, model } = mongoose;

const allowedStates = {
  values: ["accept", "decline", "like", "pass"],
  message: "{VALUE} is not allowed for {PATH}",
};

const connectionRequestSchema = new Schema(
  {
    fromUser: {
      type: String,
      required: true,
    },
    toUser: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: allowedStates,
    },
  },
  { timestamps: true }
);

export const connectionRequestModel = model(
  "connectionRequest",
  connectionRequestSchema
);
