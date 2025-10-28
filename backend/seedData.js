const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Appointment = require("./models/Appointment");

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Appointment.deleteMany({});

    // Create sample doctors
    const doctors = [
      {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@example.com",
        password: "password123",
        phone: "+1-555-0101",
        role: "doctor",
        specialization: "Cardiology",
        experience: 10,
        consultationFee: 150,
        availableSlots: [
          {
            day: "Monday",
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            day: "Tuesday",
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            day: "Wednesday",
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            day: "Thursday",
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            day: "Friday",
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
        ],
      },
      {
        name: "Dr. Michael Chen",
        email: "michael.chen@example.com",
        password: "password123",
        phone: "+1-555-0102",
        role: "doctor",
        specialization: "Neurology",
        experience: 8,
        consultationFee: 200,
        availableSlots: [
          {
            day: "Monday",
            startTime: "10:00",
            endTime: "18:00",
            isAvailable: true,
          },
          {
            day: "Tuesday",
            startTime: "10:00",
            endTime: "18:00",
            isAvailable: true,
          },
          {
            day: "Wednesday",
            startTime: "10:00",
            endTime: "18:00",
            isAvailable: true,
          },
          {
            day: "Thursday",
            startTime: "10:00",
            endTime: "18:00",
            isAvailable: true,
          },
          {
            day: "Friday",
            startTime: "10:00",
            endTime: "18:00",
            isAvailable: true,
          },
        ],
      },
      {
        name: "Dr. Emily Rodriguez",
        email: "emily.rodriguez@example.com",
        password: "password123",
        phone: "+1-555-0103",
        role: "doctor",
        specialization: "Dermatology",
        experience: 6,
        consultationFee: 120,
        availableSlots: [
          {
            day: "Monday",
            startTime: "08:00",
            endTime: "16:00",
            isAvailable: true,
          },
          {
            day: "Tuesday",
            startTime: "08:00",
            endTime: "16:00",
            isAvailable: true,
          },
          {
            day: "Wednesday",
            startTime: "08:00",
            endTime: "16:00",
            isAvailable: true,
          },
          {
            day: "Thursday",
            startTime: "08:00",
            endTime: "16:00",
            isAvailable: true,
          },
          {
            day: "Friday",
            startTime: "08:00",
            endTime: "16:00",
            isAvailable: true,
          },
        ],
      },
      {
        name: "Dr. James Wilson",
        email: "james.wilson@example.com",
        password: "password123",
        phone: "+1-555-0104",
        role: "doctor",
        specialization: "Orthopedics",
        experience: 12,
        consultationFee: 180,
        availableSlots: [
          {
            day: "Monday",
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            day: "Tuesday",
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            day: "Wednesday",
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            day: "Thursday",
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            day: "Friday",
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
        ],
      },
    ];

    // Create sample clients
    const clients = [
      {
        name: "John Smith",
        email: "john.smith@example.com",
        password: "password123",
        phone: "+1-555-0201",
        role: "client",
      },
      {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        password: "password123",
        phone: "+1-555-0202",
        role: "client",
      },
      {
        name: "Robert Brown",
        email: "robert.brown@example.com",
        password: "password123",
        phone: "+1-555-0203",
        role: "client",
      },
    ];

    // Hash passwords and create users
    const createdDoctors = [];
    for (const doctor of doctors) {
      const hashedPassword = await bcrypt.hash(doctor.password, 10);
      const createdDoctor = await User.create({
        ...doctor,
        password: hashedPassword,
      });
      createdDoctors.push(createdDoctor);
    }

    const createdClients = [];
    for (const client of clients) {
      const hashedPassword = await bcrypt.hash(client.password, 10);
      const createdClient = await User.create({
        ...client,
        password: hashedPassword,
      });
      createdClients.push(createdClient);
    }

    // Create sample appointments
    const appointments = [
      {
        client: createdClients[0]._id,
        doctor: createdDoctors[0]._id,
        appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        appointmentTime: "10:00",
        reason: "Regular checkup and blood pressure monitoring",
        status: "accepted",
        doctorNotes: "Patient is doing well, continue current medication",
      },
      {
        client: createdClients[1]._id,
        doctor: createdDoctors[1]._id,
        appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        appointmentTime: "14:00",
        reason: "Headache and dizziness consultation",
        status: "pending",
      },
      {
        client: createdClients[2]._id,
        doctor: createdDoctors[2]._id,
        appointmentDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        appointmentTime: "11:30",
        reason: "Skin rash examination",
        status: "accepted",
      },
      {
        client: createdClients[0]._id,
        doctor: createdDoctors[3]._id,
        appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        appointmentTime: "15:00",
        reason: "Knee pain consultation",
        status: "pending",
      },
      {
        client: createdClients[1]._id,
        doctor: createdDoctors[0]._id,
        appointmentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        appointmentTime: "09:00",
        reason: "Follow-up appointment",
        status: "completed",
        doctorNotes: "Patient recovered well, no further treatment needed",
      },
    ];

    await Appointment.insertMany(appointments);

    console.log("Sample data seeded successfully!");
    console.log("Created doctors:", createdDoctors.length);
    console.log("Created clients:", createdClients.length);
    console.log("Created appointments:", appointments.length);

    console.log("\nTest accounts:");
    console.log("Doctors:");
    doctors.forEach((doctor) => {
      console.log(`  ${doctor.email} / password123`);
    });
    console.log("Clients:");
    clients.forEach((client) => {
      console.log(`  ${client.email} / password123`);
    });
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

module.exports = seedData;
