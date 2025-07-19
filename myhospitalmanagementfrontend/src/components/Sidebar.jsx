"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import themeStore from "../store/themeStore"
import { ChevronDown, ChevronUp, Home, User, Settings, LogOut, Menu, Sun, Moon, TrendingUp } from "lucide-react"
import useAuthStore from "../store/authStore"

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const navigate = useNavigate()

  const { setLogOut } = useAuthStore()
  const { theme, changeTheme } = themeStore((state) => state)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
    // Update the theme store with the sidebar state
    themeStore.setState({ isSidebarOpen: !isSidebarOpen })
  }

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName)
  }

  const handleLogout = async () => {
    try {
      // const response = await axios.post('http://localhost:3000/user/api/logout', {}, { withCredentials: true });

      // if (response.data.status === 'success') {
      // disconnectSSE();
      // toast.success(response.data.message);
      toast.success("Logout Successfull")
      setTimeout(() => setLogOut(), 2000)
      localStorage.clear();
      navigate("/login")
      // }
    } catch (error) {
      console.error(error)
      toast.error("Logout failed. Please try again.")
    }
  }

  const navigation = [
    { label: "Dashboard", icon: Home, to: "/admin/dashboard" },
    {
      label: "Patients",
      icon: User,
      dropdown: true,
      items: [
        { label: "All Patients", to: "/admin/patients" },
        { label: "Patient Records", to: "/admin/patients" },
      ],
    },
    {
      label: "Doctors",
      icon: User,
      dropdown: true,
      items: [
        { label: "All Doctors", to: "/admin/doctors" },

      ],
    },
    {
      label: "Appointments",
      icon: TrendingUp,
      dropdown: true,
      items: [
        { label: "Today's Appointments", to: "/admin/appointments/today" },
        { label: "Schedule Appointment", to: "/admin/appointments/schedule" },
      ],
    },

    { label: "Settings", icon: Settings, to: "/admin/dashboard" },
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
          <h1 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>MediCare Hub</h1>
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
                        : "bg-gray-100 text-blue-600"
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
                        className={`block px-4 py-2 text-sm rounded-lg ${
                          theme === "dark"
                            ? "text-gray-400 hover:text-blue-400 hover:bg-gray-700"
                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
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
                  theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
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

export default Sidebar
