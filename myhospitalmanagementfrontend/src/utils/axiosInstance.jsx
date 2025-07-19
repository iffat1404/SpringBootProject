import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  console.log("Token in Dashboard:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
