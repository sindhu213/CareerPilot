import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
  grade: String,
});

const userSchema = new mongoose.Schema(
  {
    authUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
      unique: true
    },

    name: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: { type: String, required: true },
    portfolio: String,
    profileImageUrl: String,

    technicalSkills: [String],
    softSkills: [String],
    toolsAndTechnologies: [String],
    education: [educationSchema],
    languages: [String],
    interests: [String],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);