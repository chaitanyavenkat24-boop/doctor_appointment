import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments/doctor');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/status`, {
        status,
        doctorNotes: selectedAppointment?._id === appointmentId ? doctorNotes : ''
      });
      setSelectedAppointment(null);
      setDoctorNotes('');
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const statusCounts = {
    all: appointments.length,
    pending: appointments.filter(apt => apt.status === 'pending').length,
    accepted: appointments.filter(apt => apt.status === 'accepted').length,
    rejected: appointments.filter(apt => apt.status === 'rejected').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="mt-2 text-gray-600">Manage all your patient appointments.</p>
      </div>

      {/* Status Filter */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-full bg-primary-100">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.client.name}
                      </h3>
                      <span className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {appointment.client.email} • {appointment.client.phone}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.appointmentTime}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">Reason:</p>
                      <p className="text-gray-600">{appointment.reason}</p>
                      {appointment.notes && (
                        <>
                          <p className="font-medium mb-1 mt-2">Patient Notes:</p>
                          <p className="text-gray-600">{appointment.notes}</p>
                        </>
                      )}
                      {appointment.doctorNotes && (
                        <>
                          <p className="font-medium mb-1 mt-2">Your Notes:</p>
                          <p className="text-gray-600">{appointment.doctorNotes}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {appointment.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setDoctorNotes('');
                        }}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appointment._id, 'rejected')}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                  {appointment.status === 'accepted' && (
                    <button
                      onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                      className="btn-primary text-sm"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No appointments found</p>
            <p className="text-gray-400 text-sm mt-2">
              {filter === 'all' 
                ? "You don't have any appointments yet"
                : `No ${filter} appointments found`
              }
            </p>
          </motion.div>
        )}
      </div>

      {/* Accept Appointment Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Accept Appointment
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Add any notes for {selectedAppointment.client.name}:
            </p>
            <textarea
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="Optional notes for the patient..."
              className="w-full input-field mb-4"
              rows={3}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedAppointment(null);
                  setDoctorNotes('');
                }}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedAppointment._id, 'accepted')}
                className="btn-primary flex-1"
              >
                Accept Appointment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
