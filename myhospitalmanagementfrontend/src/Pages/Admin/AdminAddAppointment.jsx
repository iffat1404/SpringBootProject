
import { useState, useEffect, useMemo } from "react"
import axiosInstance from "../../utils/axiosInstance"
import Toast from "../../components/Toast"
import themeStore from "../../store/themeStore"
import { useNavigate } from "react-router-dom"
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  Save,
  ArrowLeft,
  UserCheck,
  CalendarPlus,
  Search,
  X,
} from "lucide-react"

const AdminAddAppointment = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    status: "ACCEPTED",
    reason: "",
    doctorId: "",
    patientId: "",
  })
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [showPatientSearch, setShowPatientSearch] = useState(false)
  const [patientSearchTerm, setPatientSearchTerm] = useState("")
  const [filteredPatients, setFilteredPatients] = useState([])

  const { theme } = themeStore((state) => state)
  const navigate = useNavigate()

  // Generate 30-minute time slots from 9 AM to 6 PM
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`)
      slots.push(`${hour.toString().padStart(2, "0")}:30`)
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  useEffect(() => {
    fetchDoctors()
    fetchPatients()
  }, [])

  useEffect(() => {
    if (patientSearchTerm) {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
          patient.patientId.toString().includes(patientSearchTerm),
      )
      setFilteredPatients(filtered)
    } else {
      setFilteredPatients(patients.slice(0, 10)) // Show first 10 patients by default
    }
  }, [patientSearchTerm, patients])

  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get("/admin/doctors")
      setDoctors(res.data)
    } catch (error) {
      console.error("Error fetching doctors", error)
      setToast({ message: "Failed to fetch doctors", type: "error" })
    } finally {
      setLoadingDoctors(false)
    }
  }

  const fetchPatients = async () => {
    try {
      const res = await axiosInstance.get("/admin/patients")
      setPatients(res.data)
      setFilteredPatients(res.data.slice(0, 10))
    } catch (error) {
      console.error("Error fetching patients", error)
      setToast({ message: "Failed to fetch patients", type: "error" })
    } finally {
      setLoadingPatients(false)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handlePatientSelect = (patient) => {
    setFormData((prev) => ({
      ...prev,
      patientId: patient.patientId.toString(), // Store as string for consistency
    }))
    setShowPatientSearch(false)
    setPatientSearchTerm("")
  }

  // --- SOLUTION 1: Use `doctor.id` to find the selected doctor ---
  const selectedDoctor = useMemo(() => {
    if (!formData.doctorId) return null
    return doctors.find((d) => d && d.id && d.id.toString() === formData.doctorId)
  }, [formData.doctorId, doctors])

  const selectedPatient = useMemo(() => {
    if (!formData.patientId) return null
    return patients.find((p) => p && p.patientId && p.patientId.toString() === formData.patientId)
  }, [formData.patientId, patients])


  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!formData.doctorId || !formData.patientId) {
      setToast({
        message: "Please select both a doctor and a patient.",
        type: "error",
      })
      return
    }

    setLoading(true)

    try {
      const appointmentData = {
        date: formData.date,
        time: formData.time,
        status: formData.status,
        reason: formData.reason,
        doctorId: Number.parseInt(formData.doctorId, 10),
        patientId: Number.parseInt(formData.patientId, 10),
      }

      await axiosInstance.post("/admin/appointments", appointmentData)
      setToast({ message: "Appointment scheduled successfully!", type: "success" })
      setTimeout(() => {
        navigate("/admin/dashboard")
      }, 1500)
    } catch (error) {
      console.error(error)
      setToast({
        message: error.response?.data?.message || "Failed to schedule appointment.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const getMinDate = () => {
    return new Date().toISOString().split("T")[0]
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "ACCEPTED":
        return theme === "dark" ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800"
      case "PENDING":
        return theme === "dark" ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-800"
      case "REJECTED":
        return theme === "dark" ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"
      default:
        return theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"
    }
  }

  const formatTimeSlot = (time) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className={`inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-lg transition-colors duration-200 ${
              theme === "dark"
                ? "text-gray-300 hover:text-white hover:bg-gray-800"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-blue-900" : "bg-blue-100"
              }`}
            >
              <CalendarPlus className={`w-6 h-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Schedule New Appointment
              </h1>
              <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Create a new appointment for a patient with a doctor
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div
          className={`rounded-xl shadow-lg border p-8 ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Date and Time Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={getMinDate()}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
                >
                  <Clock className="w-4 h-4 inline mr-2" />
                  Appointment Time
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">Select time slot...</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {formatTimeSlot(time)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Doctor Selection */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
              >
                <Stethoscope className="w-4 h-4 inline mr-2" />
                Select Doctor
              </label>
              {loadingDoctors ? (
                <div className={`p-4 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Loading doctors...
                </div>
              ) : (
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">Choose a doctor...</option>
                  {/* --- SOLUTION 2: Use `doctor.id` for key/value and `doctor.name` for display --- */}
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Selected Doctor Preview */}
              {selectedDoctor && (
                <div
                  className={`mt-3 p-4 rounded-lg border ${
                    theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Stethoscope className={`w-5 h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                    <div>
                      {/* --- SOLUTION 3: Display name from the correctly selected doctor object --- */}
                      <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {selectedDoctor.name}
                      </p>
                      <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                        Doctor ID: {selectedDoctor.id}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Patient Selection */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Select Patient
              </label>

              {!formData.patientId ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowPatientSearch(true)}
                    className={`w-full px-4 py-3 border-2 border-dashed rounded-lg transition-colors duration-200 ${
                      theme === "dark"
                        ? "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300"
                        : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700"
                    }`}
                  >
                    <Search className="w-5 h-5 inline mr-2" />
                    Click to search and select a patient
                  </button>
                </div>
              ) : (
                <div
                  className={`p-4 rounded-lg border ${
                    theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-green-50 border-green-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserCheck className={`w-5 h-5 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                      <div>
                        <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {selectedPatient?.name}
                        </p>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                          ID: {selectedPatient?.patientId} • {selectedPatient?.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, patientId: "" }))}
                      className={`p-1 rounded-full transition-colors ${
                        theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Reason */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Reason for Visit
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Describe the reason for this appointment..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            {/* Status */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
              >
                Appointment Status
              </label>
              <div className="flex gap-3">
                {["ACCEPTED", "PENDING", "REJECTED"].map((status) => (
                  <label key={status} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.status === status
                          ? getStatusColor(status)
                          : theme === "dark"
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Schedule Appointment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Patient Search Modal */}
        {showPatientSearch && (
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
                <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Select Patient
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPatientSearch(false)}
                  className={`transition-colors ${
                    theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Search Input */}
                <div className="relative mb-4">
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Search by name, email, or patient ID..."
                    value={patientSearchTerm}
                    onChange={(e) => setPatientSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>

                {/* Patient List */}
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {loadingPatients ? (
                    <div className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      Loading patients...
                    </div>
                  ) : filteredPatients.length === 0 ? (
                    <div className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      No patients found
                    </div>
                  ) : (
                    filteredPatients.map((patient) => (
                      <button
                        key={patient.patientId}
                        type="button"
                        onClick={() => handlePatientSelect(patient)}
                        className={`w-full p-4 rounded-lg border text-left transition-colors duration-200 ${
                          theme === "dark" ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <User className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                          <div>
                            <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                              {patient.name}
                            </p>
                            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                              ID: {patient.patientId} • {patient.email} • Age: {patient.age}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAddAppointment