const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rescheduled', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const Appointment = mongoose.model('Appointment', appointmentSchema); 
module.exports = Appointment