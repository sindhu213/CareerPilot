import express from 'express';
import { Resume } from "../models/Resume.js";

const router = express.Router();

// Get all resumes for a user (max 3)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const resumes = await Resume.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(3);
    
    res.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// Create a new resume
router.post('/', async (req, res) => {
  try {
    const { userId, resumeName, data } = req.body;
    
    // Check if user already has 3 resumes
    const existingCount = await Resume.countDocuments({ userId });
    
    if (existingCount >= 3) {
      return res.status(400).json({ 
        error: 'Maximum of 3 resumes allowed. Please delete one to create a new resume.' 
      });
    }
    
    const newResume = new Resume({
      userId,
      resumeName,
      data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newResume.save();
    res.status(201).json(newResume);
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

// Update an existing resume
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { resumeName, data } = req.body;
    
    const updatedResume = await Resume.findByIdAndUpdate(
      id,
      {
        resumeName,
        data,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.json(updatedResume);
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

// Delete a resume
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedResume = await Resume.findByIdAndDelete(id);
    
    if (!deletedResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.json({ message: 'Resume deleted successfully', id });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

export default router;