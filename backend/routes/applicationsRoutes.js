import express from 'express';
import Application from '../models/Application.js';

const router = express.Router();

// GET applications by user ID
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ 
        message: 'User ID is required',
        receivedUserId: userId 
      });
    }

    const applications = await Application.find({ userId }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// POST new application
router.post('/', async (req, res) => {
  try {
    const applicationData = {
      ...req.body,
      appliedDate: req.body.appliedDate || new Date().toISOString().split('T')[0]
    };

    console.log('Creating application:', applicationData);

    const application = new Application(applicationData);
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(400).json({ message: 'Error creating application', error: error.message });
  }
});

// DELETE application
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting application with ID:', req.params.id);
    const application = await Application.findByIdAndDelete(req.params.id);
    
    if (!application) {
      console.log('Application not found:', req.params.id);
      return res.status(404).json({ message: 'Application not found' });
    }
    
    console.log('Application deleted successfully:', req.params.id);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Error deleting application', error: error.message });
  }
});

export default router;