import mongoose from "mongoose";
import { messageSchema } from "./message";
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    messages: { type: [messageSchema], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
