const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms: [{
    name: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      required: true
    },
    duration: {
      type: String,
      required: true
    }
  }],
  description: {
    type: String
  },
  attachments: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Symptom', symptomSchema);