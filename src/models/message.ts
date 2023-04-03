import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const messageSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);
