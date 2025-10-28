import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Client Pages
import ClientDashboard from "./pages/client/ClientDashboard";
import FindDoctors from "./pages/client/FindDoctors";
import BookAppointment from "./pages/client/BookAppointment";
import ClientAppointments from "./pages/client/ClientAppointments";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorAvailability from "./pages/doctor/DoctorAvailability";

// Landing Page
const LandingPage = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <Navigate
        to={user.role === "client" ? "/client/dashboard" : "/doctor/dashboard"}
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">DocAppoint</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Book appointments with qualified doctors or manage your practice
            efficiently. A comprehensive solution for healthcare providers and
            patients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/login" className="btn-primary text-lg px-8 py-3">
              Get Started
            </a>
            <a href="/register" className="btn-outline text-lg px-8 py-3">
              Create Account
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              For Patients
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Find and book appointments with doctors</li>
              <li>• View appointment history and status</li>
              <li>• Easy online booking system</li>
              <li>• Real-time appointment updates</li>
            </ul>
            <a href="/register" className="btn-primary mt-4 inline-block">
              Register as Patient
            </a>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              For Doctors
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Manage patient appointments</li>
              <li>• Set your availability schedule</li>
              <li>• Accept or reject appointment requests</li>
              <li>• Track your practice efficiently</li>
            </ul>
            <a href="/register" className="btn-primary mt-4 inline-block">
              Register as Doctor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Unauthorized Page
const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
      <p className="text-gray-600 mb-8">
        You don't have permission to access this page.
      </p>
      <a href="/" className="btn-primary">
        Go Home
      </a>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Client Routes */}
          <Route
            path="/client/*"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<ClientDashboard />} />
                    <Route path="doctors" element={<FindDoctors />} />
                    <Route
                      path="book-appointment/:doctorId"
                      element={<BookAppointment />}
                    />
                    <Route
                      path="appointments"
                      element={<ClientAppointments />}
                    />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<DoctorDashboard />} />
                    <Route
                      path="appointments"
                      element={<DoctorAppointments />}
                    />
                    <Route
                      path="availability"
                      element={<DoctorAvailability />}
                    />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
