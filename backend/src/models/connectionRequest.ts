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
  { timestamps: true },
);

connectionRequestSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

// pre function for checking connection request 
connectionRequestSchema.pre("save", function (next){
  if(this.fromUser.equals(this.toUser)){
    throw new Error("Cannot send connection request to yourself!")
  }
  next()
})


export const connectionRequest = model(
  "connectionRequest",
  connectionRequestSchema,
);
