import themeStore from "../store/themeStore"

const About = () => {
  const { theme } = themeStore((state) => state)

  return (
    <div
      className={`min-h-screen pt-24 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-[#1a365d] to-[#2d3748] text-white"
          : "bg-gradient-to-br from-blue-50 to-white text-gray-900"
      }`}
    >
      {/* Hero Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">
              About <span className="text-blue-600">MediCare Hub</span>
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              We're revolutionizing healthcare management with cutting-edge technology and user-friendly solutions
              designed for modern medical facilities.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/doctor-dashboard.jpg"
                alt="Doctor using dashboard"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className={`text-lg leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                To empower healthcare professionals with innovative technology solutions that streamline operations,
                improve patient care, and enhance overall healthcare delivery efficiency.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Patient-Centered Care</h3>
                    <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      Putting patients at the heart of everything we do
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Innovation & Technology</h3>
                    <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      Leveraging latest technology for better healthcare outcomes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Seamless Integration</h3>
                    <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      Easy integration with existing hospital systems
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className={`py-20 ${theme === "dark" ? "bg-[#2d3748]" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className={`text-xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              The principles that guide our work and commitment to healthcare excellence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className={`text-center p-8 rounded-xl ${theme === "dark" ? "bg-[#1a365d]" : "bg-white"} shadow-lg`}>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🏥</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Quality Care</h3>
              <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Committed to delivering the highest standards of healthcare management solutions.
              </p>
            </div>

            <div className={`text-center p-8 rounded-xl ${theme === "dark" ? "bg-[#1a365d]" : "bg-white"} shadow-lg`}>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🔒</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Security First</h3>
              <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Ensuring patient data privacy and security with industry-leading protection measures.
              </p>
            </div>

            <div className={`text-center p-8 rounded-xl ${theme === "dark" ? "bg-[#1a365d]" : "bg-white"} shadow-lg`}>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Efficiency</h3>
              <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Streamlining healthcare operations to save time and improve patient outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Expert Team</h2>
            <p className={`text-xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Healthcare professionals and technology experts working together
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-4xl">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Dr. Sarah Johnson</h3>
              <p className="text-blue-600 mb-4">Chief Medical Officer</p>
              <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                20+ years in healthcare administration and digital transformation
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-4xl">👨‍💻</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Michael Chen</h3>
              <p className="text-blue-600 mb-4">Chief Technology Officer</p>
              <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Expert in healthcare IT systems and software architecture
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-4xl">👩‍💼</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Emily Rodriguez</h3>
              <p className="text-blue-600 mb-4">Head of Operations</p>
              <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Specialist in healthcare workflow optimization and user experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
