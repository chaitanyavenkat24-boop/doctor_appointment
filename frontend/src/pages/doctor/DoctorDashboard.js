import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("/api/appointments/doctor");
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (
    appointmentId,
    status,
    doctorNotes = ""
  ) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/status`, {
        status,
        doctorNotes,
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending"
  );
  const todayAppointments = appointments.filter((apt) => {
    const today = new Date();
    const aptDate = new Date(apt.appointmentDate);
    return (
      aptDate.toDateString() === today.toDateString() &&
      apt.status === "accepted"
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your appointments and patient care.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Appointments
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendingAppointments.length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Today's Appointments
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {todayAppointments.length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Patients
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(appointments.map((apt) => apt.client._id)).size}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pending Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Pending Appointments
        </h2>
        {pendingAppointments.length > 0 ? (
          <div className="space-y-4">
            {pendingAppointments.slice(0, 5).map((appointment) => (
              <div
                key={appointment._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-full bg-primary-100">
                      <Users className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {appointment.client.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {appointment.client.email} • {appointment.client.phone}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(
                              appointment.appointmentDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.appointmentTime}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Reason:</span>{" "}
                        {appointment.reason}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(appointment._id, "accepted")
                      }
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(appointment._id, "rejected")
                      }
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pendingAppointments.length > 5 && (
              <div className="text-center">
                <a
                  href="/doctor/appointments"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View all {pendingAppointments.length} pending appointments
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No pending appointments</p>
          </div>
        )}
      </motion.div>

      {/* Today's Appointments */}
      {todayAppointments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Today's Appointments
          </h2>
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-green-100">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {appointment.client.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointment.appointmentTime} • {appointment.reason}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleUpdateStatus(appointment._id, "completed")
                    }
                    className="btn-primary text-sm"
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DoctorDashboard;
