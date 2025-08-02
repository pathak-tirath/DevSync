import mongoose from "mongoose";

const { Schema, model } = mongoose;

const allowedStates = {
  values: ["accept", "decline", "like", "pass"],
  message: "{VALUE} is not allowed for {PATH}",
};

// ! Check why Schema level validation aren't working or need to add something.
const connectionRequestSchema = new Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,
    },
    status: {
      type: String,
      enum: allowedStates,
    },
  },
  { timestamps: true }
);

export const connectionRequest = model(
  "connectionRequest",
  connectionRequestSchema
);
