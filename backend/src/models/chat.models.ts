import mongoose, { Schema, Types } from "mongoose";

interface IChat {
  name: string;
  isGroupChat?: boolean;
  lastMessage: Types.ObjectId;
  participants: Types.ObjectId;
  admin: Types.ObjectId;
}

const chatSchema = new Schema<IChat>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model<IChat>("Chat", chatSchema);
