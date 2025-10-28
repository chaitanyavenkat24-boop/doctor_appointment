import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, X, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const ClientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments/client');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await axios.put(`/api/appointments/${appointmentId}/cancel`);
        fetchAppointments();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="mt-2 text-gray-600">View and manage your appointment bookings.</p>
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
                        Dr. {appointment.doctor.name}
                      </h3>
                      <span className={getStatusColor(appointment.status)}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(appointment.status)}
                          <span>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
                        </span>
                      </span>
                    </div>
                    <p className="text-primary-600 font-medium mb-2">
                      {appointment.doctor.specialization}
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
                      <div className="flex items-center space-x-1">
                        <span>₹{appointment.doctor.consultationFee}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">Reason:</p>
                      <p className="text-gray-600">{appointment.reason}</p>
                      {appointment.notes && (
                        <>
                          <p className="font-medium mb-1 mt-2">Notes:</p>
                          <p className="text-gray-600">{appointment.notes}</p>
                        </>
                      )}
                      {appointment.doctorNotes && (
                        <>
                          <p className="font-medium mb-1 mt-2">Doctor's Notes:</p>
                          <p className="text-gray-600">{appointment.doctorNotes}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {appointment.status === 'pending' && (
                    <button
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
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
                ? "You haven't booked any appointments yet"
                : `No ${filter} appointments found`
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ClientAppointments;
