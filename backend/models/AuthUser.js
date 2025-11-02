import mongoose from "mongoose";

const authUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true 
    },
    password: { type: String, required: true, select: false }
  },
  { timestamps: true }
);

export const AuthUser = mongoose.model("AuthUser", authUserSchema);
