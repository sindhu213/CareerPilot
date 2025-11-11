import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  duration: String,
  description: String
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  technologies: String
}, { _id: false });

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
  description: String
}, { _id: false });

const resumeDataSchema = new mongoose.Schema({
  experiences: [experienceSchema],
  projects: [projectSchema],
  educations: [educationSchema],
  summary: String,
  linkedin: String,
  github: String,
  portfolio: String,
  phone: String,
  address: String,
  certifications: [String],
  hobbies: [String]
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  resumeName: {
    type: String,
    required: true
  },
  data: {
    type: resumeDataSchema,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index to ensure a user can only have max 3 resumes
resumeSchema.index({ userId: 1, createdAt: -1 });

export const Resume = mongoose.model("Resume",resumeSchema)