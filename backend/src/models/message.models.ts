import mongoose, { Schema, Types } from "mongoose";

interface IAttachemnt {
  url: string;
}

interface IChatMessage {
  sender: Types.ObjectId;
  content?: string;
  attachment?: IAttachemnt;
  chat: Types.ObjectId;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
    attachment: {
      type: [
        {
          url: String,
        },
      ],
      default: [],
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

export const ChatMessage = mongoose.model<IChatMessage>(
  "ChatMessage",
  chatMessageSchema
);
