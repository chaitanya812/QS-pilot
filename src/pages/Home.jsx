import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import QSBottomNav from "../UI/QSBottomNav.jsx";
import QSDrawer from "../UI/QSDrawer.jsx";
import QSServiceSkeleton from "../UI/QSServiceSkeleton.jsx";
import AppRatingPopup from "../components/AppRatingPopup";

import qsLogo from "../assets/QS logo.png";
import bannerElectrician from "../assets/eletrican banner.png";
import bannerPlumber from "../assets/plumber-banner.jpg";
import bannerAC from "../assets/ac-banner.jpg";
import bannerWashing from "../assets/washing-banner.jpg";
import bannerFridge from "../assets/fridge-banner.jpg.png";
import bannerCarpenter from "../assets/carpenter-banner.jpg";

import imgElectrician from "../assets/electrician.png";
import imgPlumber from "../assets/plumber (1).png";
import imgAC from "../assets/service.png";
import imgWashing from "../assets/repair.png";
import imgFridge from "../assets/fridge.png";
import imgCarpenter from "../assets/carpenter (1).png";

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

export default function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const whatsappMessage = encodeURIComponent(
    "Hi QuickSeva 👋 I want to book a service. Please assist me."
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % categories.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const activeBanner = categories[bannerIndex] ?? categories[0];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-4 pb-28 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="rounded-lg bg-gray-200"
        >
          <img src={qsLogo} alt="QuickSeva" className="h-10 w-auto rounded-lg" />
        </button>

        <h1 className="text-lg font-bold text-gray-800">
          {user ? "Welcome to QS" : "QuickSeva"}
        </h1>

        {/* MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(true)}
          className="px-3 py-2 rounded-lg bg-gray-200 text-xl"
        >
          ☰
        </button>
      </div>

      <section
        className="relative mt-4 h-48 w-full overflow-hidden rounded-2xl shadow-lg"
        style={{
          backgroundImage: `url(${activeBanner.bannerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 flex h-full flex-col justify-between p-4 text-white">
          <div>
            <h2 className="text-xl font-bold">{activeBanner.label}</h2>
            <p className="text-sm opacity-90">Trusted professionals near you</p>
          </div>

          <div className="flex gap-2">
            <a
              href="tel:7661045308"
              aria-label="Call QuickSeva"
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold"
            >
              📞 Call
            </a>
            <a
              href={`https://wa.me/7661045308?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat on WhatsApp"
              className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <h2 className="mt-6 font-semibold text-gray-700 text-lg">
        Our Services
      </h2>

      {loading ? (
        <QSServiceSkeleton />
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <div
              key={category.label}
              onClick={() => navigate(category.path)}
              className="cursor-pointer bg-white rounded-2xl shadow-md 
              active:scale-95 transition-all duration-150
              border border-gray-100"
            >
              <div className="flex flex-col items-center p-4">
                <img
                  src={category.img}
                  alt={category.label}
                  className="h-40 w-40 object-contain"
                />
                <div className="mt-3 text-sm font-semibold text-gray-800">
                  {category.label}
                </div>
                <div className="mt-2 w-full">
                  <button
                    type="button"
                    className="w-full rounded-xl bg-qsBlue-500 py-2 text-sm font-semibold text-white"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <QSDrawer open={menuOpen} setOpen={setMenuOpen} user={user} />
      <QSBottomNav />
      <AppRatingPopup />
    </div>
  );
}
