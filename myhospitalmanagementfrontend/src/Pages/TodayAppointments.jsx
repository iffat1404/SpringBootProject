"use client"

import { useEffect, useState } from "react"
import axiosInstance from "../utils/axiosInstance"
import Toast from "../components/Toast"
import themeStore from "../store/themeStore"
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarDays,
} from "lucide-react"

const TodaysAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const { theme } = themeStore((state) => state)

  useEffect(() => {
    fetchTodaysAppointments()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, searchTerm, statusFilter])

  const fetchTodaysAppointments = async () => {
    try {
      const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD
      const response = await axiosInstance.get(`/admin/appointments/date?date=${today}`)
      setAppointments(response.data)
    } catch (error) {
      console.error(error)
      setToast({ message: "Failed to fetch today's appointments.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = appointments

    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((appointment) => appointment.status === statusFilter)
    }

    setFilteredAppointments(filtered)
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

  const getTimeCategory = (time) => {
    const hour = Number.parseInt(time.split(":")[0])
    if (hour < 12) return { label: "Morning", color: theme === "dark" ? "text-blue-400" : "text-blue-600" }
    if (hour < 17) return { label: "Afternoon", color: theme === "dark" ? "text-orange-400" : "text-orange-600" }
    return { label: "Evening", color: theme === "dark" ? "text-purple-400" : "text-purple-600" }
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center">
          <CalendarDays
            className={`w-12 h-12 mx-auto mb-4 animate-pulse ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          />
          <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>Loading today's appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-blue-900" : "bg-blue-100"
              }`}
            >
              <CalendarDays className={`w-6 h-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Today's Appointments
              </h1>
              <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{getTodayDate()}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div
              className={`p-4 rounded-lg border ${
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className={`w-8 h-8 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                <div>
                  <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {appointments.length}
                  </p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Total</p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {appointments.filter((a) => a.status === "ACCEPTED").length}
                  </p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Accepted</p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {appointments.filter((a) => a.status === "PENDING").length}
                  </p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Pending</p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {appointments.filter((a) => a.status === "REJECTED").length}
                  </p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Rejected</p>
                </div>
              </div>
            </div>
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
                <input
                  type="text"
                  placeholder="Search by doctor name, patient name, or reason..."
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

            {/* Status Filter */}
            <div className="md:w-48">
              <div className="relative">
                <Filter
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className={`mt-4 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className={`text-center py-12 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
            <CalendarDays
              className={`w-12 h-12 mx-auto mb-4 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
            />
            <h3 className={`text-lg font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {appointments.length === 0 ? "No appointments scheduled for today" : "No appointments found"}
            </h3>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
              {searchTerm || statusFilter
                ? "Try adjusting your search criteria"
                : "Enjoy your free day or check back later for updates"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const timeCategory = getTimeCategory(appointment.time)
              return (
                <div
                  key={appointment.appointmentId}
                  className={`rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 hover:shadow-gray-900/20"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Section - Main Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            theme === "dark" ? "bg-blue-900" : "bg-blue-100"
                          }`}
                        >
                          <Calendar className={`w-6 h-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3
                              className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                            >
                              Appointment #{appointment.appointmentId}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                                appointment.status,
                              )}`}
                            >
                              {getStatusIcon(appointment.status)}
                              {appointment.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Doctor Info */}
                            <div className="space-y-2">
                              <div
                                className={`flex items-center gap-2 text-sm ${
                                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                <Stethoscope className="w-4 h-4" />
                                <span className="font-medium">Doctor:</span>
                                <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
                                  Dr. {appointment.doctorName}
                                </span>
                              </div>
                              <div
                                className={`flex items-center gap-2 text-sm ${
                                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                <User className="w-4 h-4" />
                                <span className="font-medium">Patient:</span>
                                <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
                                  {appointment.patientName}
                                </span>
                              </div>
                            </div>

                            {/* Time & Reason */}
                            <div className="space-y-2">
                              <div
                                className={`flex items-center gap-2 text-sm ${
                                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">Time:</span>
                                <span className={`font-semibold ${timeCategory.color}`}>
                                  {formatTime(appointment.time)}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${timeCategory.color} bg-opacity-10`}>
                                  {timeCategory.label}
                                </span>
                              </div>
                              <div
                                className={`flex items-start gap-2 text-sm ${
                                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                <FileText className="w-4 h-4 mt-0.5" />
                                <span className="font-medium">Reason:</span>
                                <span className={`flex-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                  {appointment.reason}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - IDs */}
                    <div
                      className={`lg:text-right space-y-1 text-xs ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <p>Doctor ID: {appointment.doctorId}</p>
                      <p>Patient ID: {appointment.patientId}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TodaysAppointments
