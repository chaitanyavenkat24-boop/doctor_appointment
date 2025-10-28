import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, Star } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FindDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialization) {
      filtered = filtered.filter(doctor =>
        doctor.specialization.toLowerCase().includes(specialization.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchTerm, specialization]);

  const handleBookAppointment = (doctorId) => {
    navigate(`/client/book-appointment/${doctorId}`);
  };

  const specializations = [...new Set(doctors.map(doctor => doctor.specialization))];

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
        <h1 className="text-3xl font-bold text-gray-900">Find Doctors</h1>
        <p className="mt-2 text-gray-600">Search and book appointments with qualified doctors.</p>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="input-field"
          >
            <option value="">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
          <div className="text-sm text-gray-500 flex items-center">
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor, index) => (
          <motion.div
            key={doctor._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-lg transition-shadow duration-200"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  {doctor.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Dr. {doctor.name}
              </h3>
              <p className="text-primary-600 font-medium mb-2">
                {doctor.specialization}
              </p>
              <div className="flex items-center justify-center mb-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">
                  {doctor.experience} years experience
                </span>
              </div>
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">
                  ₹{doctor.consultationFee} consultation
                </span>
              </div>
              <button
                onClick={() => handleBookAppointment(doctor._id)}
                className="btn-primary w-full"
              >
                <Calendar className="h-4 w-4 inline mr-2" />
                Book Appointment
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No doctors found matching your criteria</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms</p>
        </motion.div>
      )}
    </div>
  );
};

export default FindDoctors;
