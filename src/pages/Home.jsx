import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import QSBottomNav from "../UI/QSBottomNav.jsx";
import QSDrawer from "../UI/QSDrawer.jsx";
import QSServiceSkeleton from "../UI/QSServiceSkeleton.jsx";
import AppRatingPopup from "../components/AppRatingPopup"; // ✅ ONLY ADDITION
//Qs logo
import qsLogo from "../assets/QS logo.png"

// Banner Images
import bannerElectrician from "../assets/eletrican banner.png";
import bannerPlumber from "../assets/plumber-banner.jpg";
import bannerAC from "../assets/ac-banner.jpg";
import bannerWashing from "../assets/washing-banner.jpg";
import bannerFridge from "../assets/fridge-banner.jpg.png";
import bannerCarpenter from "../assets/carpenter-banner.jpg";


// Service Icons
// Service Icons (PILOT – FINAL)
import imgElectrician from "../assets/electrican.png";
import imgPlumber from "../assets/plumber service.png";
import imgAC from "../assets/ac service.png";
import imgWashing from "../assets/washing service.png";
import imgFridge from "../assets/Fridge service.png";
import imgCarpenter from "../assets/carpenter service.png";

export default function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const whatsappMessage = encodeURIComponent(
    "Hi QuickSeva 👋 I want to book a service. Please assist me."
  );


  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  const categories = [
    {
      label: "Electrician",
      img: imgElectrician,
      path: "/electrician-plumber",
      bannerImg: bannerElectrician,
    },
    {
      label: "Plumber",
      img: imgPlumber,
      path: "/plumber",
      bannerImg: bannerPlumber,
    },
    {
      label: "AC Service",
      img: imgAC,
      path: "/ac",
      bannerImg: bannerAC,
    },
    {
      label: "Washing Machine",
      img: imgWashing,
      path: "/washing-machine",
      bannerImg: bannerWashing,
    },
    {
      label: "Fridge Repair",
      img: imgFridge,
      path: "/refrigerator",
      bannerImg: bannerFridge,
    },
    {
      label: "Carpenter",
      img: imgCarpenter,
      path: "/carpenter",
      bannerImg: bannerCarpenter,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % categories.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [categories.length]);

  const activeBanner = categories[bannerIndex];

  return (
    <div className="p-4 pb-28 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMenuOpen(true)}
          className=" rounded-lg bg-gray-200"
        >
          <img src={qsLogo} alt="QuickSeva" className="h-10 w-auto rounded-lg" />
        </button>

        <h1 className="text-lg font-bold">
          {user ? "Welcome to QS" : "QuickSeva"}
        </h1>

        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-1 rounded-lg bg-qsBlue-500 text-white"
          >
            Login
          </button>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="px-3 py-1 rounded-lg bg-red-500 text-white"
          >
            Logout
          </button>
        )}
      </div>

      {/* AUTO SCROLL BANNER */}
      <div
        className="mt-4 relative w-full h-48 rounded-2xl overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(${activeBanner.bannerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />
        <div className="relative z-10 h-full flex flex-col justify-between p-4 text-white">
          <div>
            <h2 className="text-xl font-bold">{activeBanner.label}</h2>
            <p className="text-sm opacity-90">
              Trusted professionals near you
            </p>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            <a
              href="tel:7661045308"
              className="px-4 py-2 bg-green-600 rounded-xl font-semibold"
            >
              📞 Call
            </a>
            <a
              href={`https://wa.me/7661045308?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-green-500 rounded-xl font-semibold"
            >
              💬 WhatsApp
            </a>

          </div>
        </div>
      </div>

      {/* SERVICES GRID */}
      <h2 className="mt-6 font-semibold text-gray-700 text-lg">
        Our Services
      </h2>

      {loading ? (
        <QSServiceSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-3">
          {categories.map((c) => (
            <div
              key={c.label}
              onClick={() => navigate(c.path)}
              className="cursor-pointer bg-white rounded-2xl shadow-md 
             active:scale-95 transition-all duration-150
             border border-gray-100"
            >
              <div className="p-4 flex flex-col items-center">
                <img
                  src={c.img}
                  alt={c.label}
                  className="w-40 h-40 object-contain"
                />

                <div className="mt-3 text-sm font-semibold text-gray-800">
                  {c.label}
                </div>

                {/* CTA BUTTON */}
                <div className="mt-2 w-full">
                  <button className="w-full py-2 rounded-xl bg-qsBlue-500 text-white text-sm font-semibold">
                    Book Now
                  </button>
                </div>
              </div>
            </div>

          ))}
        </div>
      )}

      {/* WHY CHOOSE US */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-5">
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          Why Choose QuickSeva?
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gray-50 shadow-sm text-center">
            <span className="text-3xl">⚡</span>
            <h3 className="font-semibold text-gray-700 mt-2 text-sm">
              Fast Service
            </h3>
            <p className="text-xs text-gray-500">
              Quick response & doorstep support
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 shadow-sm text-center">
            <span className="text-3xl">👨‍🔧</span>
            <h3 className="font-semibold text-gray-700 mt-2 text-sm">
              Our professionals
            </h3>
            <p className="text-xs text-gray-500">
              Verified & experienced professionals
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 shadow-sm text-center">
            <span className="text-3xl">💰</span>
            <h3 className="font-semibold text-gray-700 mt-2 text-sm">
              Affordable Pricing
            </h3>
            <p className="text-xs text-gray-500">
              Best service at best price
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 shadow-sm text-center">
            <span className="text-3xl">⭐</span>
            <h3 className="font-semibold text-gray-700 mt-2 text-sm">
              Customer Satisfaction
            </h3>
            <p className="text-xs text-gray-500">
              Service you can trust
            </p>
          </div>
        </div>
      </div>

      <QSDrawer open={menuOpen} setOpen={setMenuOpen} user={user} />
      <QSBottomNav />

      {/* ⭐ APP RATING POPUP */}
      <AppRatingPopup />
    </div>
  );
}
