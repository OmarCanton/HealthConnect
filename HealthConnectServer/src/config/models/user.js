const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true,
        unique: true
    },
    emergencyContact: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthdate: {
        type: String,
        required: true
    },
    license: String,
    specialization: String,
    profileImage: String,
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },
    allergies: [
        {type: String}
    ],
    medicalConditions: [
        {type: String}
    ],
    role: {
        type: String,
        enum: ['patient', 'doctor'],
        default: 'patient'
    },
    isAuthenticated: {
        type: Boolean,
        default: false
    },
    token: String
})

const User = mongoose.model('User', UserSchema)

module.exports = User