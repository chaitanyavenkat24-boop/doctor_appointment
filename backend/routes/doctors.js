const express = require('express');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all doctors (for clients)
router.get('/', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('-password -availableSlots')
      .sort({ name: 1 });

    res.json(doctors);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id)
      .select('-password');

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update doctor availability
router.put('/availability', auth, requireRole(['doctor']), async (req, res) => {
  try {
    const { availableSlots } = req.body;

    const doctor = await User.findByIdAndUpdate(
      req.user._id,
      { availableSlots },
      { new: true }
    ).select('-password');

    res.json(doctor);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
