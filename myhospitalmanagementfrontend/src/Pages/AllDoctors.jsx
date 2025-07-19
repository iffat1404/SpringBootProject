"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../utils/axiosInstance"
import Toast from "../components/Toast"
import themeStore from "../store/themeStore"
import {
  User,
  Mail,
  Phone,
  Stethoscope,
  Building,
  Trash2,
  Calendar,
  Search,
  Filter,
  UserPlus,
  X,
  Clock,
} from "lucide-react"

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  // Specialization filter is disabled as the data is not provided by the API
  // const [specializationFilter, setSpecializationFilter] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loadingAppointments, setLoadingAppointments] = useState(false)

  const { theme } = themeStore((state) => state)

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    roomNumber: "",
  })

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    filterDoctors()
    // NOTE: Removed specializationFilter from dependency array
  }, [doctors, searchTerm])

  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get("/admin/doctors")
      setDoctors(response.data)
    } catch (error) {
      console.error(error)
      setToast({ message: "Failed to fetch doctors", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  // --- FIX: Use doctorId parameter correctly ---
  const fetchDoctorAppointments = async (doctorId) => {
    setLoadingAppointments(true)
    try {
      // The endpoint expects a query param `doctorId`, so we pass it
      const response = await axiosInstance.get(`/doctor/appointments?doctorId=${doctorId}`)
      setAppointments(response.data)
    } catch (error) {
      console.error(error)
      setToast({ message: "Failed to fetch appointments", type: "error" })
      setAppointments([])
    } finally {
      setLoadingAppointments(false)
    }
  }

  const handleAddDoctor = async () => {
    try {
      // This assumes the POST endpoint can handle all these fields
      await axiosInstance.post("/admin/doctor", newDoctor)
      setToast({ message: "Doctor added successfully", type: "success" })
      fetchDoctors()
      setShowAddModal(false)
      setNewDoctor({
        name: "",
        email: "",
        password: "",
        phone: "",
        specialization: "",
        roomNumber: "",
      })
    } catch (error) {
      console.error(error)
      setToast({ message: "Failed to add doctor", type: "error" })
    }
  }

  // --- FIX: Use doctorId parameter correctly ---
  const deleteDoctor = async (doctorId) => {
    try {
      await axiosInstance.delete(`/admin/doctor/${doctorId}`)
      setToast({ message: "Doctor deleted successfully", type: "success" })
      fetchDoctors()
      setShowDeleteModal(false)
      setSelectedDoctor(null)
    } catch (error) {
      console.error(error)
      setToast({ message: "Failed to delete doctor", type: "error" })
    }
  }

  const filterDoctors = () => {
    let filtered = doctors

    if (searchTerm) {
      // --- FIX: Simplified filter to only use `name` as other fields are not available ---
      filtered = filtered.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // --- FIX: Removed specialization filter logic ---
    // if (specializationFilter) { ... }

    setFilteredDoctors(filtered)
  }

  const openDeleteModal = (doctor) => {
    setSelectedDoctor(doctor)
    setShowDeleteModal(true)
  }

  // --- FIX: Pass `doctor.id` instead of `doctor.doctorId` ---
  const openAppointmentModal = (doctor) => {
    setSelectedDoctor(doctor)
    setShowAppointmentModal(true)
    fetchDoctorAppointments(doctor.id)
  }

  // This function is no longer needed as specialization is not available
  // const getSpecializationColor = (specialization) => { ... }

  const getStatusColor = (status) => {
    switch (status) {
      case "ACCEPTED":
        return theme === "dark"
          ? "bg-green-900 text-green-200 border-green-700"
          : "bg-green-50 text-green-700 border-green-200"
      case "REJECTED":
        return theme === "dark" ? "bg-red-900 text-red-200 border-red-700" : "bg-red-50 text-red-700 border-red-200"
      default:
        return theme === "dark"
          ? "bg-yellow-900 text-yellow-200 border-yellow-700"
          : "bg-yellow-50 text-yellow-700 border-yellow-200"
    }
  }

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>Loading doctors...</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Doctor Management
              </h1>
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                Manage all registered doctors in the system
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <UserPlus className="w-4 h-4" />
              Add New Doctor
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div
          className={`rounded-lg shadow-sm border p-6 mb-6 ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                {/* --- FIX: Updated placeholder text --- */}
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
            </div>

            {/* Specialization Filter - DISABLED */}
            {/*
            <div className="md:w-48">
              ... filter dropdown removed ...
            </div>
            */}
          </div>

          {/* Results Count */}
          <div className={`mt-4 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Showing {filteredDoctors.length} of {doctors.length} doctors
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className={`text-center py-12 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
            <Stethoscope className={`w-12 h-12 mx-auto mb-4 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
            <h3 className={`text-lg font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              No doctors found
            </h3>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
              {searchTerm ? "Try adjusting your search criteria" : "No doctors registered yet"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* --- FIX: Use `doctor.id` for key --- */}
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className={`rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between ${
                  theme === "dark" ? "bg-gray-800 border-gray-700 hover:shadow-gray-900/20" : "bg-white border-gray-200"
                }`}
              >
                <div>
                  {/* Doctor Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          theme === "dark" ? "bg-blue-900" : "bg-blue-100"
                        }`}
                      >
                        <Stethoscope className={`w-6 h-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                      </div>
                      <div>
                        {/* --- FIX: Removed specialization from display --- */}
                        <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                           {doctor.name}
                        </h3>
                      </div>
                    </div>
                    <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      {/* --- FIX: Use `doctor.id` for display --- */}
                      ID: {doctor.id}
                    </div>
                  </div>

                  {/* Doctor Details - REMOVED as data is not available */}
                  <div className="space-y-3 mb-6">
                    <p className="text-sm text-gray-400">
                      More details like email, phone, etc. can be displayed here when the API provides them.
                    </p>
                  </div>
                </div>


                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => openAppointmentModal(doctor)}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                      theme === "dark"
                        ? "bg-green-900 text-green-200 hover:bg-green-800"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Appointments
                  </button>
                  <button
                    onClick={() => openDeleteModal(doctor)}
                    className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                      theme === "dark"
                        ? "bg-red-900 text-red-200 hover:bg-red-800"
                        : "bg-red-50 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Doctor Modal (assuming POST endpoint works with these fields) */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`rounded-xl shadow-xl w-full max-w-lg p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Add New Doctor
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`transition-colors ${
                    theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newDoctor.password}
                  onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newDoctor.phone}
                  onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Specialization (e.g., Cardiology, Pediatrics)"
                  value={newDoctor.specialization}
                  onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Room Number (e.g., 110, A-205)"
                  value={newDoctor.roomNumber}
                  onChange={(e) => setNewDoctor({ ...newDoctor, roomNumber: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDoctor}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Doctor
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-xl shadow-xl w-full max-w-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      theme === "dark" ? "bg-red-900" : "bg-red-100"
                    }`}
                  >
                    <Trash2 className={`w-6 h-6 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      Delete Doctor
                    </h3>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <p className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Are you sure you want to delete <strong>{selectedDoctor.name}</strong>? This will permanently
                  remove all doctor data and appointment records.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setSelectedDoctor(null)
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      theme === "dark"
                        ? "text-gray-300 bg-gray-700 hover:bg-gray-600"
                        : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    Cancel
                  </button>
                  {/* --- FIX: Use `selectedDoctor.id` in the delete function --- */}
                  <button
                    onClick={() => deleteDoctor(selectedDoctor.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete Doctor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Modal */}
        {showAppointmentModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className={`flex items-center justify-between p-6 border-b ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      theme === "dark" ? "bg-green-900" : "bg-green-100"
                    }`}
                  >
                    <Calendar className={`w-5 h-5 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      Doctor Appointments
                    </h3>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {selectedDoctor.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAppointmentModal(false)
                    setSelectedDoctor(null)
                    setAppointments([])
                  }}
                  className={`transition-colors ${
                    theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {loadingAppointments ? (
                  <p className={`text-center py-8 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    Loading appointments...
                  </p>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar
                      className={`w-12 h-12 mx-auto mb-4 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                    />
                    <h4 className={`text-lg font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      No Appointments Found
                    </h4>
                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                      This doctor has no scheduled appointments.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment, index) => (
                      <div
                        key={appointment.appointmentId || index}
                        className={`rounded-lg p-4 border ${
                          theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              theme === "dark" ? "bg-blue-900" : "bg-blue-100"
                            }`}
                          >
                            <User className={`w-5 h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                              Patient: {appointment.patientName || `ID: ${appointment.patientId}`}
                            </h4>
                            <div
                              className={`space-y-1 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                            >
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{appointment.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{appointment.time}</span>
                              </div>
                              <p>
                                <span className="font-medium">Reason:</span> {appointment.reason}
                              </p>
                            </div>
                            <div className="mt-3">
                              <span
                                className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                                  appointment.status,
                                )}`}
                              >
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllDoctors