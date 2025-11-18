import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  jobTitle: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  appliedDate: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'interview', 'rejected', 'accepted'],
    default: 'pending'
  },
  nextStep: { 
    type: String 
  },
  notes: { 
    type: String 
  },
  jobUrl: { 
    type: String 
  }
}, {
  timestamps: true
});

export default mongoose.model('Application', applicationSchema);
