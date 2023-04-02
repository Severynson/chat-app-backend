import mongoose, { Types } from "mongoose";
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

export default mongoose.model("Message", messageSchema);
