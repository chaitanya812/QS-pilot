import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* =====================================================
   CORE USER PAGES
===================================================== */
import Home from "./pages/Home.jsx";
import Booking from "./pages/Booking.jsx";
import BookingSuccess from "./pages/BookingSuccess.jsx";
import CartScreen from "./pages/CartScreen.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Profile from "./pages/Profile.jsx";
import LiveTracking from "./pages/LiveTracking.jsx";

/* =====================================================
   TECHNICIAN STATUS PAGES
===================================================== */
import TechAccept from "./pages/TechAccept.jsx";
import TechDecline from "./pages/TechDecline.jsx";
import TechOnWay from "./pages/TechOnWay.jsx";
import TechStart from "./pages/TechStart.jsx";
import TechDone from "./pages/TechDone.jsx";

/* =====================================================
   AUTH
===================================================== */
import PhoneLogin from "./pages/PhoneLogin.jsx";
import OtpVerify from "./pages/OtpVerify.jsx";

/* =====================================================
   ADMIN
===================================================== */
import AdminDashboardLocal from "./pages/AdminDashboardLocal.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

/* =====================================================
   TECHNICIAN
===================================================== */
import TechnicianDashboard from "./pages/TechnicianDashboard.jsx";
import TechnicianLogin from "./pages/TechnicianLogin.jsx";

/* =====================================================
   ROUTE GUARD
===================================================== */
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

/* =====================================================
   SERVICES
===================================================== */
import ServiceDetail from "./pages/Services/ServiceDetail.jsx";
import BikeCarService from "./pages/Services/BikeCar.jsx";
import BeautySalon from "./pages/Services/BeautySalon.jsx";
import DecorationDetails from "./pages/Services/DecorationDetails.jsx";
import CarpenterDetails from "./pages/Services/CarpenterDetails.jsx";
import ACAppliances from "./pages/Services/AcAppliances.jsx";
import ElectricianPlumber from "./pages/Services/ElectricianPlumber.jsx";
import Plumber from "./pages/Services/Plumber.jsx";
import Washing from "./pages/Services/Washing.jsx";
import Frigde from "./pages/Services/Frigde.jsx";

/* =====================================================
   UTILITIES
===================================================== */
import { initTechnicians } from "./utils/initTechnicians";

/* =====================================================
   CART
===================================================== */
import { CartProvider } from "./utils/CartContext.jsx";

export default function App() {
  /* ===================================================
     INITIALIZE TECHNICIANS
  =================================================== */
  useEffect(() => {
    const setupTechnicians = async () => {
      try {
        await initTechnicians();
      } catch (error) {
        console.error(
          "Technician initialization failed:",
          error
        );
      }
    };

    setupTechnicians();
  }, []);

  return (
    <CartProvider>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route path="/login" element={<PhoneLogin />} />
        <Route path="/phone-login" element={<PhoneLogin />} />
        <Route path="/otp" element={<OtpVerify />} />

        {/* CUSTOMER / PROTECTED */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-success"
          element={
            <ProtectedRoute>
              <BookingSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* LIVE TRACKING */}
        <Route
          path="/track/:bookingId"
          element={
            <ProtectedRoute>
              <LiveTracking />
            </ProtectedRoute>
          }
        />

        {/* TECHNICIAN ACTIONS */}
        <Route path="/tech/accept/:bookingId" element={<TechAccept />} />
        <Route path="/tech/decline/:bookingId" element={<TechDecline />} />
        <Route path="/tech/onway/:bookingId" element={<TechOnWay />} />
        <Route path="/tech/start/:bookingId" element={<TechStart />} />
        <Route path="/tech/done/:bookingId" element={<TechDone />} />

        {/* TECHNICIAN DASHBOARD */}
        <Route path="/tech-login" element={<TechnicianLogin />} />
        <Route path="/tech" element={<TechnicianDashboard />} />

        {/* ADMIN */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboardLocal />} />

        {/* SERVICE PAGES */}
        <Route path="/bike" element={<BikeCarService />} />
        <Route path="/bike-car" element={<BikeCarService />} />
        <Route path="/beauty" element={<BeautySalon />} />
        <Route path="/beauty-salon" element={<BeautySalon />} />
        <Route path="/decoration" element={<DecorationDetails />} />
        <Route path="/carpenter" element={<CarpenterDetails />} />
        <Route path="/ac" element={<ACAppliances />} />
        <Route
          path="/electrician-plumber"
          element={<ElectricianPlumber />}
        />
        <Route path="/plumber" element={<Plumber />} />
        <Route path="/washing-machine" element={<Washing />} />
        <Route path="/refrigerator" element={<Frigde />} />
        <Route path="/service-detail" element={<ServiceDetail />} />

        <Route
          path="/view-cart"
          element={<Navigate to="/cart" replace />}
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
}
