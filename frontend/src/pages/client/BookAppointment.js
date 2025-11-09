import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import axios from "axios";

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchDoctor = useCallback(async () => {
    try {
      const response = await axios.get(`/api/doctors/${doctorId}`);
      setDoctor(response.data);
    } catch (error) {
      console.error("Error fetching doctor:", error);
      setError("Doctor not found");
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    console.log('BookAppointment useEffect running, doctorId:', doctorId);
    fetchDoctor();
  }, [doctorId, fetchDoctor]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await axios.post("/api/appointments/book", {
        doctorId,
        ...formData,
      });
      navigate("/client/appointments");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Doctor not found</p>
        <button
          onClick={() => navigate("/client/doctors")}
          className="btn-primary mt-4"
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/client/doctors")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-gray-600">
            Schedule your appointment with Dr. {doctor.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="card sticky top-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-600">
                  {doctor.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Dr. {doctor.name}
              </h3>
              <p className="text-primary-600 font-medium mb-4">
                {doctor.specialization}
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{doctor.experience} years experience</span>
                </div>
                <div className="flex items-center justify-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>₹{doctor.consultationFee} consultation</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Appointment Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="appointmentDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    id="appointmentDate"
                    name="appointmentDate"
                    required
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="input-field"
                  />
                </div>

                <div>
                  <label
                    htmlFor="appointmentTime"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <Clock className="h-4 w-4 inline mr-1" />
                    Time Slot
                  </label>
                  <select
                    id="appointmentTime"
                    name="appointmentTime"
                    required
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Reason for Appointment *
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  required
                  rows={3}
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Please describe the reason for your appointment..."
                  className="input-field"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional information you'd like to share..."
                  className="input-field"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/client/doctors")}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                  ) : (
                    "Book Appointment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookAppointment;
