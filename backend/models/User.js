import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
  grade: String,
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    location: { type: String },
    linkedin: { type: String },
    github: { type: String, required: true },
    portfolio: { type: String },
    profileImageUrl: { type: String },

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