import { Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Page404 from "./Pages/Page404";
import About from "./Pages/About";

import AdminDashboard from "./Pages/AdminDashboard";
import DoctorDashboard from "./Pages/DoctorDashboard";
import PatientDashboard from "./Pages/PatientDashboard";
import AllPatients from "./Pages/AllPatients";
import PublicLayout from "./layouts/PublicLayout";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AllDoctors from "./Pages/AllDoctors";
import TodaysAppointments from "./Pages/TodayAppointments";
import AdminAddAppointment from "./Pages/AdminAddAppointment";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Signup />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Page404 />} />
      </Route>

      {/* Protected Routes for each role */}
      <Route element={<MainLayout />}>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AllPatients />  
            </ProtectedRoute>
          }
        />
         <Route
          path="/admin/appointments/schedule"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminAddAppointment />  
            </ProtectedRoute>
          }
        />
         <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AllDoctors />  
            </ProtectedRoute>
          }
        />

        <Route
  path="/admin/appointments/today"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <TodaysAppointments />
    </ProtectedRoute>
  }
/>

        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
