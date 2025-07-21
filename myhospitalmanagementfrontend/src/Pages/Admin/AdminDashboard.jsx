import authStore from "../../store/authStore"
import Sidebar from "../../components/Sidebar"
import TopSearchBar from "../../components/TopSearchBar"
import themeStore from "../../store/themeStore"

const AdminDashboard = () => {
  const { isLoggedIn, role } = authStore((state) => state)
  const { theme } = themeStore((state) => state)

  return (
    <div
      className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} h-screen w-screen flex`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col w-full">
        <TopSearchBar />

        <div className="flex-1 p-6 ml-64">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Hospital Dashboard</h1>
            <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Welcome back! Here's what's happening at your hospital today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Total Patients</p>
                  <p className="text-3xl font-bold text-blue-600">1,247</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-2xl">👥</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-500 text-sm">↗ +12% from last month</span>
              </div>
            </div>

            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Active Doctors</p>
                  <p className="text-3xl font-bold text-green-600">89</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-2xl">👨‍⚕️</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-500 text-sm">↗ +3 new this week</span>
              </div>
            </div>

            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Today's Appointments
                  </p>
                  <p className="text-3xl font-bold text-purple-600">156</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-2xl">📅</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-blue-500 text-sm">23 pending confirmations</span>
              </div>
            </div>

            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Available Beds</p>
                  <p className="text-3xl font-bold text-orange-600">42</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 text-2xl">🛏️</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-orange-500 text-sm">78% occupancy rate</span>
              </div>
            </div>
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">👤</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">New patient registered</p>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      John Doe - Emergency Department
                    </p>
                  </div>
                  <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>2 min ago</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">✅</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Surgery completed</p>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      Dr. Smith - Operating Room 3
                    </p>
                  </div>
                  <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>15 min ago</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600">📋</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Lab results ready</p>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      Patient ID: 12345 - Blood Test
                    </p>
                  </div>
                  <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>1 hour ago</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 text-center">
                  <div className="text-2xl mb-2">👤</div>
                  <div className="font-medium">Add Patient</div>
                </button>

                <button className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300 text-center">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="font-medium">Schedule Appointment</div>
                </button>

                <button className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-300 text-center">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-medium">View Reports</div>
                </button>

                <button className="p-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-300 text-center">
                  <div className="text-2xl mb-2">🏥</div>
                  <div className="font-medium">Manage Departments</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
