import themeStore from "../store/themeStore"
import authStore from "../store/authStore"
import { Link } from "react-router-dom"

const Landing = () => {
  const { theme } = themeStore((state) => state)
  const { isLoggedIn } = authStore((state) => state)

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-[#1a365d] to-[#2d3748] text-white"
          : "bg-gradient-to-br from-blue-50 to-white text-gray-900"
      }`}
    >
      {/* Hero Section */}
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Modern Healthcare
                  <span className="text-blue-600 block">Management</span>
                </h1>
                <p className={`text-xl leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  Streamline your hospital operations with our comprehensive management system. Manage patients,
                  doctors, appointments, and medical records all in one place.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300 text-center"
                >
                  Get Started
                </Link>
                <Link
                  to="/about"
                  className={`px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-semibold transition-colors duration-300 text-center ${
                    theme === "dark" ? "hover:text-white" : ""
                  }`}
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">500+</div>
                  <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Hospitals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">10K+</div>
                  <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Doctors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1M+</div>
                  <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Patients</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <img
                src="/images/hospital-hero.jpg"
                alt="Modern Hospital"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-20 ${theme === "dark" ? "bg-[#2d3748]" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Complete Hospital Management Solution</h2>
            <p className={`text-xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Everything you need to run a modern healthcare facility
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div
              className={`p-8 rounded-xl shadow-lg transition-colors duration-300 ${
                theme === "dark" ? "bg-[#1a365d]" : "bg-white"
              }`}
            >
              <img
                src="/images/medical-team.jpg"
                alt="Medical Team"
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
              <h3 className="text-2xl font-semibold mb-4">Staff Management</h3>
              <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Efficiently manage doctors, nurses, and administrative staff with role-based access control.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className={`p-8 rounded-xl shadow-lg transition-colors duration-300 ${
                theme === "dark" ? "bg-[#1a365d]" : "bg-white"
              }`}
            >
              <img
                src="/images/hospital.jpg"
                alt="Hospital Room"
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
              <h3 className="text-2xl font-semibold mb-4">Patient Care</h3>
              <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Comprehensive patient records, treatment history, and real-time monitoring capabilities.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className={`p-8 rounded-xl shadow-lg transition-colors duration-300 ${
                theme === "dark" ? "bg-[#1a365d]" : "bg-white"
              }`}
            >
              <img
                src="/images/medical-equipment.jpg"
                alt="Medical Equipment"
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
              <h3 className="text-2xl font-semibold mb-4">Equipment Tracking</h3>
              <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Track medical equipment, maintenance schedules, and inventory management.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Healthcare Management?</h2>
          <p className={`text-xl mb-8 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Join thousands of healthcare professionals who trust MediCare Hub for their daily operations.
          </p>
          <Link
            to="/register"
            className="inline-block px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors duration-300"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Landing
