const Appointment = require("../config/models/Appointment");

const getAppointments = async (req, res) => {
    let appointments;

    // Doctors see all their appointments, patients see theirs
    if (req.user.role === 'doctor') {
        appointments = await Appointment.find({ doctorId: req.user._id })
        .populate('patientId', 'firstName lastName')
        .sort({ appointmentDate: -1 });
    } else {
        appointments = await Appointment.find({ patientId: req.user._id })
        .populate('doctorId', 'firstName lastName specialization')
        .sort({ appointmentDate: -1 });
    }

    res.json({
        success: true,
        count: appointments.length,
        appointments
    });
}

const createAppointment = async (req, res) => {
    const { doctorId, appointmentDate, reason, notes } = req.body;
    // Only patients can create appointments
    if (req.user.role !== 'patient') {
        res.status(403).json({ message: 'Only patients can create appointments' });
    }

    // Verify doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
        res.status(404).json({ message: 'Doctor not found'})
    }

    const appointment = await Appointment.create({
        patientId: req.user._id,
        doctorId,
        appointmentDate,
        reason,
        notes
    });

    // Populate doctor info for response
    await appointment.populate('doctorId', 'firstName lastName specialization');

    res.status(201).json({
        success: true,
        appointment
    });
}

const updateAppointment = async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        res.status(404).json({message: 'Appointment not found'});
    }

    // Check if user is authorized to update this appointment
    if (req.user.role === 'doctor') {
        // Doctors can only update appointments with them as the doctor
        if (appointment.doctorId.toString() !== req.user._id.toString()) {
            res.status(403).json({message: 'Not authorized to update this appointment'});
        }
    } else {
        // Patients can only update their own appointments
        if (appointment.patientId.toString() !== req.user._id.toString()) {
            res.status(403).json({message: 'Not authorized to update this appointment'})
        }
    }

    // Update appointment fields
    const { status, appointmentDate, reason, notes } = req.body;

    if (status) appointment.status = status;
    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (reason) appointment.reason = reason;
    if (notes !== undefined) appointment.notes = notes;

    const updatedAppointment = await appointment.save();

    // Populate appropriate fields for response
    if (req.user.role === 'doctor') {
        await updatedAppointment.populate('patientId', 'firstName lastName');
    } else {
        await updatedAppointment.populate('doctorId', 'firstName lastName specialization');
    }

    res.json({
        success: true,
        appointment: updatedAppointment
    });
}

const deleteAppointment = async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        res.status(404).json({message: 'Appointment not found'})
    }

    // Check if user is authorized to delete this appointment
    if (req.user.role === 'doctor') {
        // Doctors can only delete appointments with them as the doctor
        if (appointment.doctorId.toString() !== req.user._id.toString()) {
            res.status(403).json({message: 'Not authorized to delete this appointment'})
        }
    } else {
        // Patients can only delete their own appointments
        if (appointment.patientId.toString() !== req.user._id.toString()) {
            res.status(403).json({message: 'Not authorized to delete this appointment'})
        }
    }

    await appointment.remove();

    res.json({
        success: true,
        message: 'Appointment removed'
    })
}

module.exports = {
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
}