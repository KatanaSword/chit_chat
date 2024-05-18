import mongoose, { Schema } from "mongoose";

interface IAvatar {
  url: string;
}

interface IUser {
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  phoneNumber: number;
  password: string;
  about?: string;
  avatar?: IAvatar;
  refreshToken?: string;
  forgotPasswordToken?: string;
  forgotPasswordExpiry?: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
      minLength: 10,
      maxLength: 10,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    about: {
      type: String,
      trim: true,
    },
    avatar: {
      type: {
        url: String,
        publicId: String,
      },
      default: {
        url: "",
        publicId: "",
      },
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
