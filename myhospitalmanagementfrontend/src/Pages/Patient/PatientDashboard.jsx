"use client"

import { useState, useEffect } from "react"
import useAuthStore from "../../store/authStore"
import PatientSidebar from "./PatientSidebar"
import TopSearchBar from "../../components/TopSearchBar"
import themeStore from "../../store/themeStore"
import axiosInstance from "../../utils/axiosInstance"
import Toast from "../../components/Toast"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import {
  Calendar,
  Clock,
  Pill,
  Stethoscope,
  Heart,
  FileText,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Activity,
} from "lucide-react"

const PatientDashboard = () => {
  const { isLoggedIn, role } = useAuthStore((state) => state)
  const { theme } = themeStore((state) => state)
  const [patientData, setPatientData] = useState({
    appointments: [],
    prescriptions: [],
    upcomingAppointments: 0,
    activePrescriptions: 0,
    totalDoctors: 0,
  })
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [patientInfo, setPatientInfo] = useState({ name: "", id: "" })
  const navigate = useNavigate()

  useEffect(() => {
    // Get patient info from token
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        if (decoded.role === "PATIENT" && decoded.patientId) {
          setPatientInfo({
            name: decoded.name || "Patient",
            id: decoded.patientId,
          })
          fetchPatientData(decoded.patientId)
        } else {
          navigate("/login")
        }
      } catch (err) {
        console.error("Invalid token:", err)
        navigate("/login")
      }
    }
  }, [navigate])

  const fetchPatientData = async (patientId) => {
    try {
      // Fetch appointments
      const appointmentsRes = await axiosInstance.get("/patient/appointments")
      const appointments = appointmentsRes.data || []

      // Fetch prescriptions
      const prescriptionsRes = await axiosInstance.get(`/patient/prescriptions?patientId=${patientId}`)
      const prescriptions = prescriptionsRes.data || []

      // Calculate stats
      const upcomingAppointments = appointments.filter(
        (apt) => apt.status === "ACCEPTED" && new Date(apt.date) >= new Date(),
      ).length

      setPatientData({
        appointments: appointments.slice(0, 3), // Show recent 3
        prescriptions: prescriptions.slice(0, 3), // Show recent 3
        upcomingAppointments,
        activePrescriptions: prescriptions.length,
        totalDoctors: 3, // This would come from API
      })
    } catch (error) {
      console.error("Error fetching patient data:", error)
      setToast({ message: "Failed to load the dashboard data", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
    }
  }

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

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div
        className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} h-screen w-screen flex`}
      >
        <PatientSidebar />
        <div className="flex flex-col w-full">
          <TopSearchBar />
          <div className="flex-1 flex items-center justify-center ml-64">
            <div className="text-center">
              <Activity
                className={`w-12 h-12 mx-auto mb-4 animate-pulse ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              />
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>Loading your health dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} h-screen w-screen flex`}
    >
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Sidebar */}
      <PatientSidebar />

      {/* Main Content */}
      <div className="flex flex-col w-full">
        <TopSearchBar />

        <div className="flex-1 p-6 ml-64">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {patientInfo.name}!</h1>
                <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  Here's your health overview and upcoming appointments.
                </p>
              </div>
            </div>
          </div>

          {/* Health Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Upcoming Appointments
                  </p>
                  <p className="text-3xl font-bold text-blue-600">{patientData.upcomingAppointments}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-blue-600 w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-blue-500 text-sm">Next appointment soon</span>
              </div>
            </div>

            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Active Prescriptions
                  </p>
                  <p className="text-3xl font-bold text-green-600">{patientData.activePrescriptions}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Pill className="text-green-600 w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-500 text-sm">All medications current</span>
              </div>
            </div>

            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>My Doctors</p>
                  <p className="text-3xl font-bold text-purple-600">{patientData.totalDoctors}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Stethoscope className="text-purple-600 w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-purple-500 text-sm">Healthcare team</span>
              </div>
            </div>

            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Health Score</p>
                  <p className="text-3xl font-bold text-orange-600">85%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Heart className="text-orange-600 w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-orange-500 text-sm">Good overall health</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upcoming Appointments */}
            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Upcoming Appointments
                </h3>
                <button
                  onClick={() => navigate("/patient/appointments/upcoming")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>

              {patientData.appointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar
                    className={`w-12 h-12 mx-auto mb-4 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                  />
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>No upcoming appointments</p>
                  <button
                    onClick={() => navigate("/patient/appointments/request")}
                    className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Request Appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {patientData.appointments.map((appointment, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Stethoscope className="text-blue-600 w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">Dr. {appointment.doctorName}</p>
                            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                              {formatDate(appointment.date)} at {formatTime(appointment.time)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            appointment.status,
                          )}`}
                        >
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/patient/appointments/request")}
                  className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 text-center"
                >
                  <Calendar className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">Request Appointment</div>
                </button>

                <button
                  onClick={() => navigate("/patient/prescriptions")}
                  className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300 text-center"
                >
                  <Pill className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">View Prescriptions</div>
                </button>

                <button
                  onClick={() => navigate("/patient/doctors/specialists")}
                  className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-300 text-center"
                >
                  <Stethoscope className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">Find Specialists</div>
                </button>

                <button
                  onClick={() => navigate("/patient/medical-history")}
                  className="p-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-300 text-center"
                >
                  <FileText className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">Medical History</div>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className={`mt-8 p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Pill className="w-5 h-5 text-green-600" />
                Current Prescriptions
              </h3>
              <button
                onClick={() => navigate("/patient/prescriptions")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>

            {patientData.prescriptions.length === 0 ? (
              <div className="text-center py-8">
                <Pill className={`w-12 h-12 mx-auto mb-4 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
                <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>No active prescriptions</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patientData.prescriptions.map((prescription, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Pill className="text-green-600 w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {prescription.medication}
                        </h4>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                          {prescription.dosage}
                        </p>
                        <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                          Prescribed by Dr. {prescription.doctorId}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Health Reminders */}
          <div className={`mt-8 p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              Health Reminders
            </h3>
            <div className="space-y-3">
              <div
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  theme === "dark" ? "bg-yellow-900/20 border-yellow-700" : "bg-yellow-50 border-yellow-200"
                } border`}
              >
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className={`font-medium ${theme === "dark" ? "text-yellow-200" : "text-yellow-800"}`}>
                    Annual Checkup Due
                  </p>
                  <p className={`text-sm ${theme === "dark" ? "text-yellow-300" : "text-yellow-600"}`}>
                    Schedule your yearly physical examination
                  </p>
                </div>
              </div>
              <div
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  theme === "dark" ? "bg-blue-900/20 border-blue-700" : "bg-blue-50 border-blue-200"
                } border`}
              >
                <Pill className="w-5 h-5 text-blue-600" />
                <div>
                  <p className={`font-medium ${theme === "dark" ? "text-blue-200" : "text-blue-800"}`}>
                    Medication Refill
                  </p>
                  <p className={`text-sm ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`}>
                    Blood pressure medication expires in 5 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
