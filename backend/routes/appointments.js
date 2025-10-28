const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all appointments (for doctors)
router.get('/doctor', auth, requireRole(['doctor']), async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('client', 'name email phone')
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments (for clients)
router.get('/client', auth, requireRole(['client']), async (req, res) => {
  try {
    const appointments = await Appointment.find({ client: req.user._id })
      .populate('doctor', 'name specialization consultationFee')
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book appointment
router.post('/book', auth, requireRole(['client']), [
  body('doctorId').notEmpty().withMessage('Doctor ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('appointmentTime').notEmpty().withMessage('Appointment time is required'),
  body('reason').notEmpty().withMessage('Reason for appointment is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { doctorId, appointmentDate, appointmentTime, reason, notes } = req.body;

    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({ message: 'Doctor not found' });
    }

    // Check if appointment slot is available
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create appointment
    const appointment = new Appointment({
      client: req.user._id,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      reason,
      notes: notes || ''
    });

    await appointment.save();

    // Populate the appointment with doctor details
    await appointment.populate('doctor', 'name specialization consultationFee');

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status (for doctors)
router.put('/:id/status', auth, requireRole(['doctor']), [
  body('status').isIn(['accepted', 'rejected', 'completed']).withMessage('Invalid status'),
  body('doctorNotes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, doctorNotes } = req.body;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, doctor: req.user._id },
      { status, doctorNotes: doctorNotes || '' },
      { new: true }
    ).populate('client', 'name email phone');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel appointment (for clients)
router.put('/:id/cancel', auth, requireRole(['client']), async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, client: req.user._id },
      { status: 'cancelled' },
      { new: true }
    ).populate('doctor', 'name specialization consultationFee');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
