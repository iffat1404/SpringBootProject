
import { useState, useEffect } from "react"
import axiosInstance from "../utils/axiosInstance"
import Toast from "../components/Toast"
import { User, Mail, Phone, Calendar, MapPin, Trash2, FileText, Search, Filter, UserPlus, X, Pill } from "lucide-react"

const AllPatients = () => {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [ageFilter, setAgeFilter] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [prescriptions, setPrescriptions] = useState([])
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false)

  
  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    filterPatients()
  }, [patients, searchTerm, ageFilter])

  const fetchPatients = async () => {
    try {
      const response = await axiosInstance.get("/admin/patients")
      setPatients(response.data)
    } catch (error) {
      console.error(error)
      setToast({ message: "Failed to fetch patients", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const fetchPatientPrescriptions = async (patientId) => {
    setLoadingPrescriptions(true)
    try {
      const response = await axiosInstance.get(`/patient/prescriptions?patientId=${patientId}`)
      setPrescriptions(response.data)
    } catch (error) {
      console.error(error)
      setToast({ message: "Failed to fetch prescriptions", type: "error" })
      setPrescriptions([])
    } finally {
      setLoadingPrescriptions(false)
    }
  }
  const [showAddModal, setShowAddModal] = useState(false)

const [newPatient, setNewPatient] = useState({
  name: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  dateOfBirth: "",
})

const handleAddPatient = async () => {
  try {
    await axiosInstance.post("/admin/patient", newPatient)
    setToast({ message: "Patient added successfully", type: "success" })
    fetchPatients()
    setShowAddModal(false)
    setNewPatient({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      dateOfBirth: "",
    })
  } catch (error) {
    console.error(error)
    setToast({ message: "Failed to add patient", type: "error" })
  }
}

  const deletePatient = async (patientId) => {
    try {
      await axiosInstance.delete(`/admin/patient/${patientId}`)
      setToast({ message: "Patient deleted successfully", type: "success" })
      fetchPatients()
      setShowDeleteModal(false)
      setSelectedPatient(null)
    } catch (error) {
      console.error(error)
      setToast({ message: "Failed to delete patient", type: "error" })
    }
  }

  const filterPatients = () => {
    let filtered = patients

    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone.includes(searchTerm),
      )
    }

    if (ageFilter) {
      filtered = filtered.filter((patient) => {
        const age = patient.age
        switch (ageFilter) {
          case "child":
            return age < 18
          case "adult":
            return age >= 18 && age < 65
          case "senior":
            return age >= 65
          default:
            return true
        }
      })
    }

    setFilteredPatients(filtered)
  }

  const openDeleteModal = (patient) => {
    setSelectedPatient(patient)
    setShowDeleteModal(true)
  }

  const openPrescriptionModal = (patient) => {
    setSelectedPatient(patient)
    setShowPrescriptionModal(true)
    fetchPatientPrescriptions(patient.patientId)
  }

  const getAgeCategory = (age) => {
    if (age < 18) return { label: "Child", color: "bg-blue-100 text-blue-800" }
    if (age < 65) return { label: "Adult", color: "bg-green-100 text-green-800" }
    return { label: "Senior", color: "bg-purple-100 text-purple-800" }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading patients...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
            <p className="text-gray-600">Manage all registered patients in the system</p>
          </div>
        <button
  onClick={() => setShowAddModal(true)}
  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
>
  <UserPlus className="w-4 h-4" /> Add New Patient
</button>
{showAddModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Add New Patient</h3>
        <button
          onClick={() => setShowAddModal(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={newPatient.name}
          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
        />
        <input
          type="email"
          placeholder="Email"
          value={newPatient.email}
          onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={newPatient.password}
          onChange={(e) => setNewPatient({ ...newPatient, password: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Phone"
          value={newPatient.phone}
          onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Address"
          value={newPatient.address}
          onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
        />
        <input
          type="date"
          placeholder="Date of Birth"
          value={newPatient.dateOfBirth}
          onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setShowAddModal(false)}
          className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleAddPatient}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Patient
        </button>
      </div>
    </div>
  </div>
)}

        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Age Filter */}
          <div className="md:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Ages</option>
                <option value="child">Children (&lt;18)</option>
                <option value="adult">Adults (18-64)</option>
                <option value="senior">Seniors (65+)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredPatients.length} of {patients.length} patients
        </div>
      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600">
            {searchTerm || ageFilter ? "Try adjusting your search criteria" : "No patients registered yet"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => {
            const ageCategory = getAgeCategory(patient.age)
            return (
              <div
                key={patient.patientId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                {/* Patient Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${ageCategory.color}`}
                      >
                        {ageCategory.label}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">ID: {patient.patientId}</div>
                </div>

                {/* Patient Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{patient.age} years old</span>
                  </div>
                  {patient.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span className="line-clamp-2">{patient.address}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openPrescriptionModal(patient)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    Prescriptions
                  </button>
                  <button
                    onClick={() => openDeleteModal(patient)}
                    className="inline-flex items-center justify-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modals remain unchanged — just removed LoadingSpinner inside modal */}
      {showDeleteModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Patient</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{selectedPatient.name}</strong>? This will permanently remove
                all patient data and medical records.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedPatient(null)
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deletePatient(selectedPatient.patientId)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete Patient
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPrescriptionModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Medical Prescriptions</h3>
                  <p className="text-sm text-gray-600">{selectedPatient.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPrescriptionModal(false)
                  setSelectedPatient(null)
                  setPrescriptions([])
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loadingPrescriptions ? (
                <p className="text-center py-8 text-gray-600">Loading prescriptions...</p>
              ) : prescriptions.length === 0 ? (
                <div className="text-center py-8">
                  <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions Found</h4>
                  <p className="text-gray-600">This patient has no prescription history.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((prescription, index) => (
                    <div key={prescription.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Pill className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{prescription.medication}</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              <span className="font-medium">Dosage:</span> {prescription.dosage}
                            </p>
                            <p>
                              <span className="font-medium">Instructions:</span> {prescription.instructions}
                            </p>
                            <p>
                              <span className="font-medium">Prescribed by:</span> Dr. {prescription.doctorId}
                            </p>
                            {prescription.date && (
                              <p>
                                <span className="font-medium">Date:</span> {prescription.date}
                              </p>
                            )}
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
  )
}

export default AllPatients
