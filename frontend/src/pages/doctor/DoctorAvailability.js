import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Save, Plus, X } from "lucide-react";
import axios from "axios";

const DoctorAvailability = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
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

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      setAvailableSlots(response.data.user.availableSlots || []);
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = (day) => {
    const newSlot = {
      day,
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    };
    setAvailableSlots([...availableSlots, newSlot]);
  };

  const updateTimeSlot = (index, field, value) => {
    const updatedSlots = [...availableSlots];
    updatedSlots[index] = {
      ...updatedSlots[index],
      [field]: value,
    };
    setAvailableSlots(updatedSlots);
  };

  const removeTimeSlot = (index) => {
    const updatedSlots = availableSlots.filter((_, i) => i !== index);
    setAvailableSlots(updatedSlots);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("/api/doctors/availability", {
        availableSlots,
      });
      // Show success message or notification
    } catch (error) {
      console.error("Error saving availability:", error);
    } finally {
      setSaving(false);
    }
  };

  const getSlotsForDay = (day) => {
    return availableSlots.filter((slot) => slot.day === day);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Availability</h1>
          <p className="mt-2 text-gray-600">
            Set your available time slots for appointments.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      <div className="space-y-6">
        {days.map((day, dayIndex) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIndex * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{day}</h3>
              <button
                onClick={() => addTimeSlot(day)}
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Add Slot</span>
              </button>
            </div>

            <div className="space-y-3">
              {getSlotsForDay(day).map((slot, slotIndex) => {
                const globalIndex = availableSlots.findIndex((s) => s === slot);
                return (
                  <div
                    key={globalIndex}
                    className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        From:
                      </span>
                      <select
                        value={slot.startTime}
                        onChange={(e) =>
                          updateTimeSlot(
                            globalIndex,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">
                        To:
                      </span>
                      <select
                        value={slot.endTime}
                        onChange={(e) =>
                          updateTimeSlot(globalIndex, "endTime", e.target.value)
                        }
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`available-${globalIndex}`}
                        checked={slot.isAvailable}
                        onChange={(e) =>
                          updateTimeSlot(
                            globalIndex,
                            "isAvailable",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`available-${globalIndex}`}
                        className="text-sm text-gray-700"
                      >
                        Available
                      </label>
                    </div>

                    <button
                      onClick={() => removeTimeSlot(globalIndex)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}

              {getSlotsForDay(day).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No time slots set for {day}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Click "Add Slot" to add availability
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Setup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Setup
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              const weekdays = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
              ];
              const newSlots = weekdays.map((day) => ({
                day,
                startTime: "09:00",
                endTime: "17:00",
                isAvailable: true,
              }));
              setAvailableSlots([...availableSlots, ...newSlots]);
            }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <h4 className="font-medium text-gray-900">Weekdays Only</h4>
            <p className="text-sm text-gray-600">9:00 AM - 5:00 PM</p>
          </button>
          <button
            onClick={() => {
              const allDays = days;
              const newSlots = allDays.map((day) => ({
                day,
                startTime: "09:00",
                endTime: "17:00",
                isAvailable: true,
              }));
              setAvailableSlots([...availableSlots, ...newSlots]);
            }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <h4 className="font-medium text-gray-900">Full Week</h4>
            <p className="text-sm text-gray-600">9:00 AM - 5:00 PM</p>
          </button>
          <button
            onClick={() => {
              const weekdays = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
              ];
              const newSlots = weekdays.map((day) => ({
                day,
                startTime: "14:00",
                endTime: "18:00",
                isAvailable: true,
              }));
              setAvailableSlots([...availableSlots, ...newSlots]);
            }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <h4 className="font-medium text-gray-900">Afternoons Only</h4>
            <p className="text-sm text-gray-600">2:00 PM - 6:00 PM</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorAvailability;
