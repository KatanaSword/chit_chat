import { Schema, Model, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  AvailableUserRoles,
  UserRoles,
  USER_TEMPORARY_TOKEN_EXPIRY,
  USER_TEMPORARY_OTP_EXPIRY,
} from "../constants";

interface IAvatar {
  url: string;
  publicId: string;
}

interface IUser {
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  phoneNumber: number;
  password: string;
  role: string;
  about?: string;
  avatar: IAvatar;
  refreshToken?: string;
  forgotPasswordToken?: string;
  forgotPasswordExpiry?: Date;
  isEmailVerified?: boolean;
  isPhoneNumberVerified?: boolean;
  phoneNumberVerificationToken?: string;
  phoneNumberVerificationExpiry?: Date;
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

interface ITemporaryToken {
  unHashedToken: string;
  hashedToken: string;
  tokenExpiry: number;
}

interface IOtp {
  unHashedOTP: string;
  hashedOTP: string;
  OTPExpiry: number;
}

export type UserModel = Model<IUser, {}, ITemporaryToken, IOtp>;

const userSchema = new Schema<IUser, UserModel, ITemporaryToken, IOtp>(
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
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    about: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRoles.USER,
      required: true,
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
      required: true,
    },
    refreshToken: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneNumberVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumberVerificationToken: {
      type: String,
    },
    phoneNumberVerificationExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      phoneNumber: this.phoneNumber,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECURE!,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECURE!,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateTemporaryToken = function (): ITemporaryToken {
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + USER_TEMPORARY_TOKEN_EXPIRY;

  return { unHashedToken, hashedToken, tokenExpiry };
};

userSchema.methods.generateTemporaryOTP = function (): IOtp {
  const unHashedOTP = crypto.randomInt(100000, 999999).toString();

  const hashedOTP = crypto
    .createHash("sha256")
    .update(unHashedOTP)
    .digest("hex");

  const OTPExpiry = Date.now() + USER_TEMPORARY_OTP_EXPIRY;

  return { unHashedOTP, hashedOTP, OTPExpiry };
};

export const User = model<IUser, UserModel>("User", userSchema);
