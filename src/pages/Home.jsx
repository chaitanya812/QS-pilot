import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import QSBottomNav from "../UI/QSBottomNav.jsx";
import QSDrawer from "../UI/QSDrawer.jsx";
import QSServiceSkeleton from "../UI/QSServiceSkeleton.jsx";
import AppRatingPopup from "../components/AppRatingPopup"; // ✅ ONLY ADDITION

// Service Icons
// Service Icons (PILOT – FINAL)
import imgElectrician from "../assets/eletrician.png";
import imgPlumber from "../assets/eletrician.png";
import imgAC from "../assets/ac.png";
import imgWashing from "../assets/ac.png";
import imgFridge from "../assets/ac.png";
import imgCarpenter from "../assets/carpenter.png";



export default function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  const categories = [
  {
    label: "Electrician",
    img: imgElectrician,
    path: "/electrician-plumber",
    bannerImg:
      "https://images.unsplash.com/photo-1581092919535-7146c1c9c6c9",
  },
  {
    label: "Plumber",
    img: imgPlumber,
    path: "/plumber",
    bannerImg:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
  },
  {
    label: "AC Service",
    img: imgAC,
    path: "/ac",
    bannerImg:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4",
  },
  {
    label: "Washing Machine",
    img: imgWashing,
    path: "/washing-machine",
    bannerImg:
      "https://images.unsplash.com/photo-1626806787461-102c1a7a6c2f",
  },
  {
    label: "Refrigerator",
    img: imgFridge,
    path: "/refrigerator",
    bannerImg:
      "https://images.unsplash.com/photo-1586208958839-06c17cacdf08",
  },
  {
    label: "Carpenter",
    img: imgCarpenter,
    path: "/carpenter",
    bannerImg:
      "https://images.unsplash.com/photo-1598300056393-4aac492f4344",
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
          className="p-2 rounded-lg bg-gray-200"
        >
          ☰
        </button>

        <h1 className="text-lg font-bold">
          {user ? "Welcome" : "QuickSeva"}
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
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 h-full flex flex-col justify-between p-4 text-white">
          <div>
            <h2 className="text-xl font-bold">{activeBanner.label}</h2>
            <p className="text-sm opacity-90">
              Trusted professionals near you
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href="tel:+7661045308"
              className="px-4 py-2 bg-green-600 rounded-xl font-semibold"
            >
              📞 Call
            </a>
            <a
              href="https://wa.me/7661045308"
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
              className="cursor-pointer p-4 bg-white rounded-xl shadow text-center"
            >
              <img src={c.img} className="w-16 h-16 mx-auto" />
              <div className="mt-2 text-sm font-medium">{c.label}</div>
            </div>
          ))}
        </div>
      )}

      <QSDrawer open={menuOpen} setOpen={setMenuOpen} user={user} />
      <QSBottomNav />

      {/* ⭐ APP RATING POPUP */}
      <AppRatingPopup />
    </div>
  );
}
