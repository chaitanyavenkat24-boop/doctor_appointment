const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockUsers = [
  {
    _id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'doctor',
    specialization: 'Cardiology',
    experience: 10,
    consultationFee: 150,
    phone: '+1-555-0101'
  },
  {
    _id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@example.com',
    role: 'doctor',
    specialization: 'Neurology',
    experience: 8,
    consultationFee: 200,
    phone: '+1-555-0102'
  },
  {
    _id: '3',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'client',
    phone: '+1-555-0201'
  }
];

const mockAppointments = [
  {
    _id: '1',
    client: { _id: '3', name: 'John Smith', email: 'john.smith@example.com', phone: '+1-555-0201' },
    doctor: { _id: '1', name: 'Dr. Sarah Johnson', specialization: 'Cardiology', consultationFee: 150 },
    appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    appointmentTime: '10:00',
    reason: 'Regular checkup',
    status: 'accepted',
    doctorNotes: 'Patient is doing well'
  }
];

// Mock authentication middleware
const mockAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  // Mock user based on token
  req.user = { _id: '3', role: 'client', name: 'John Smith', email: 'john.smith@example.com' };
  next();
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running! (Mock Mode)' });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email && password === 'password123');
  
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  res.json({
    token: 'mock-token',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      ...(user.role === 'doctor' && { 
        specialization: user.specialization, 
        experience: user.experience, 
        consultationFee: user.consultationFee 
      })
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, role, specialization, experience, consultationFee } = req.body;
  
  const newUser = {
    _id: Date.now().toString(),
    name,
    email,
    role,
    phone,
    ...(role === 'doctor' && { specialization, experience, consultationFee })
  };
  
  mockUsers.push(newUser);
  
  res.status(201).json({
    token: 'mock-token',
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      ...(role === 'doctor' && { 
        specialization: newUser.specialization, 
        experience: newUser.experience, 
        consultationFee: newUser.consultationFee 
      })
    }
  });
});

app.get('/api/auth/me', mockAuth, (req, res) => {
  res.json({ user: req.user });
});

// Doctor routes
app.get('/api/doctors', (req, res) => {
  const doctors = mockUsers.filter(u => u.role === 'doctor').map(d => ({
    _id: d._id,
    name: d.name,
    email: d.email,
    specialization: d.specialization,
    experience: d.experience,
    consultationFee: d.consultationFee
  }));
  res.json(doctors);
});

app.get('/api/doctors/:id', (req, res) => {
  const doctor = mockUsers.find(u => u._id === req.params.id && u.role === 'doctor');
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }
  res.json(doctor);
});

// Appointment routes
app.get('/api/appointments/client', mockAuth, (req, res) => {
  const clientAppointments = mockAppointments.filter(apt => apt.client._id === req.user._id);
  res.json(clientAppointments);
});

app.get('/api/appointments/doctor', mockAuth, (req, res) => {
  const doctorAppointments = mockAppointments.filter(apt => apt.doctor._id === req.user._id);
  res.json(doctorAppointments);
});

app.post('/api/appointments/book', mockAuth, (req, res) => {
  const { doctorId, appointmentDate, appointmentTime, reason, notes } = req.body;
  const doctor = mockUsers.find(u => u._id === doctorId);
  
  if (!doctor) {
    return res.status(400).json({ message: 'Doctor not found' });
  }
  
  const newAppointment = {
    _id: Date.now().toString(),
    client: req.user,
    doctor: {
      _id: doctor._id,
      name: doctor.name,
      specialization: doctor.specialization,
      consultationFee: doctor.consultationFee
    },
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    reason,
    notes: notes || '',
    status: 'pending'
  };
  
  mockAppointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

app.put('/api/appointments/:id/status', mockAuth, (req, res) => {
  const { status, doctorNotes } = req.body;
  const appointment = mockAppointments.find(apt => apt._id === req.params.id);
  
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  
  appointment.status = status;
  if (doctorNotes) appointment.doctorNotes = doctorNotes;
  
  res.json(appointment);
});

app.put('/api/appointments/:id/cancel', mockAuth, (req, res) => {
  const appointment = mockAppointments.find(apt => apt._id === req.params.id);
  
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  
  appointment.status = 'cancelled';
  res.json(appointment);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (Mock Mode - No Database Required)`);
  console.log('Available test accounts:');
  console.log('  Client: john.smith@example.com / password123');
  console.log('  Doctor: sarah.johnson@example.com / password123');
});
