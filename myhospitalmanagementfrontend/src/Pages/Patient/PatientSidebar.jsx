"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import themeStore from "../../store/themeStore"
import {
  ChevronDown,
  ChevronUp,
  Home,
  Settings,
  LogOut,
  Menu,
  Sun,
  Moon,
  Calendar,
  FileText,
  Stethoscope,
  Heart,
  UserCheck,
} from "lucide-react"
import useAuthStore from "../../store/authStore"

const PatientSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const navigate = useNavigate()

  const { setLogOut } = useAuthStore()
  const { theme, changeTheme } = themeStore((state) => state)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
    themeStore.setState({ isSidebarOpen: !isSidebarOpen })
  }

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName)
  }

  const handleLogout = async () => {
    try {
      toast.success("Logout Successful")
      setTimeout(() => setLogOut(), 2000)
      localStorage.clear()
      navigate("/login")
    } catch (error) {
      console.error(error)
      toast.error("Logout failed. Please try again.")
    }
  }

  const navigation = [
    { label: "Dashboard", icon: Home, to: "/patient/dashboard" },
    {
      label: "My Appointments",
      icon: Calendar,
      dropdown: true,
      items: [
        { label: "Upcoming Appointments", to: "/patient/appointments/upcoming" },
        { label: "Request Appointment", to: "/patient/appointments/request" },
        { label: "Appointment History", to: "/patient/appointments/history" },
        { label: "Reschedule/Cancel", to: "/patient/appointments/manage" },
      ],
    },
    {
      label: "Medical Records",
      icon: FileText,
      dropdown: true,
      items: [
        { label: "My Prescriptions", to: "/patient/prescriptions" },
        { label: "Lab Reports", to: "/patient/lab-reports" },
        { label: "Medical History", to: "/patient/medical-history" },
        { label: "Vaccination Records", to: "/patient/vaccinations" },
      ],
    },
    {
      label: "Healthcare Team",
      icon: Stethoscope,
      dropdown: true,
      items: [
        { label: "My Doctors", to: "/patient/doctors/my-doctors" },
        { label: "Find Specialists", to: "/patient/doctors/specialists" },
        { label: "Department Directory", to: "/patient/departments" },
      ],
    },
    {
      label: "Health & Wellness",
      icon: Heart,
      dropdown: true,
      items: [
        { label: "Health Tracker", to: "/patient/health-tracker" },
        { label: "Medication Reminders", to: "/patient/medication-reminders" },
        { label: "Health Tips", to: "/patient/health-tips" },
      ],
    },
    { label: "My Profile", icon: UserCheck, to: "/patient/profile" },
    { label: "Settings", icon: Settings, to: "/patient/settings" },
  ]

  return (
    <div
      className={`${isSidebarOpen ? "w-64" : "w-20"} fixed h-full z-20 transition-all duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 border-b ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {isSidebarOpen && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              MediCare Patient
            </h1>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-lg ${
            theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigation.map((item, idx) => (
          <div key={idx} className="relative">
            {item.dropdown ? (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activeDropdown === item.label
                      ? theme === "dark"
                        ? "bg-gray-700 text-blue-400"
                        : "bg-blue-50 text-blue-600"
                      : theme === "dark"
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {isSidebarOpen && (
                    <>
                      <span className="ml-3 flex-1 text-left">{item.label}</span>
                      {activeDropdown === item.label ? (
                        <ChevronUp className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDown className="w-5 h-5 ml-2" />
                      )}
                    </>
                  )}
                </button>
                {activeDropdown === item.label && isSidebarOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {item.items.map((subItem, subIdx) => (
                      <Link
                        key={subIdx}
                        to={subItem.to}
                        className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                          theme === "dark"
                            ? "text-gray-400 hover:text-blue-400 hover:bg-gray-700"
                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.to}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={`absolute bottom-0 w-full p-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
      >
        <button
          onClick={changeTheme}
          className={`flex items-center w-full p-3 rounded-lg transition-colors ${
            theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {isSidebarOpen && <span className="ml-3">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`flex items-center w-full p-3 rounded-lg transition-colors ${
            theme === "dark" ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50"
          }`}
        >
          <LogOut className="w-5 h-5" />
          {isSidebarOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
      <ToastContainer />
    </div>
  )
}

export default PatientSidebar
