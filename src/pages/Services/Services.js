import React from "react";
import {
  SparklesIcon,
  BoltIcon,
  Cog6ToothIcon,
  ScissorsIcon,
  PaintBrushIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  // All categories
  const categories = [
    { label: "Cooking & Babysitting", icon: UserGroupIcon },
    { label: "Bike & Car Service", icon: TruckIcon },
    { label: "Electrician & Plumber", icon: BoltIcon },
    { label: "AC's & Appliances", icon: Cog6ToothIcon },
    { label: "Carpenter & Wallstickering", icon: WrenchScrewdriverIcon },
    { label: "Beauty & Salon", icon: ScissorsIcon },
    { label: "Cleaning & Pest Control", icon: PaintBrushIcon },
    { label: "Decoration & Events", icon: SparklesIcon },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
        OnCall
      </h1>

      {/* My Booking Button */}
      <button
        className="cursor-pointer bg-green-600 text-white p-4 rounded-xl text-lg font-semibold"
        onClick={() => navigate("my")}
      >
        My Bookings
      </button>

      {/* Banner */}
      <div className="mt-4 w-full h-40 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 shadow-md" />

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for a Service..."
        className="w-full p-3 rounded-xl bg-gray-100 mt-2 outline-none focus:ring-2 focus:ring-gray-300"
      />

      <h2 className="text-xl font-semibold text-black mt-3 mb-3 text-center">
        Our Services
      </h2>

      {/* Service Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.label}
            onClick={() => {
              if (cat.label === "Cooking & Babysitting") {
                navigate("/cooking");
              } 
              else if (cat.label === "Electrician & Plumber") {
                navigate("/electrician-plumber");
              } 
              else {
                navigate("/booking", { state: { service: cat.label } });
              }
            }}
            className="flex flex-col items-center p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
          >
            <cat.icon className="w-10 h-10 text-gray-700" />
            <span className="mt-2 text-sm font-medium">{cat.label}</span>
          </div>
        ))}
      </div>

      {/* Why Choose Us */}
      <h2 className="text-xl font-semibold">Why Choose Us</h2>

      <div className="space-y-3">
        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-medium">✔ Trusted Professionals</h3>
          <p className="text-sm text-gray-600">
            Verified and background-checked experts.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-medium">✔ Quick & Easy Booking</h3>
          <p className="text-sm text-gray-600">Book services in under 60 seconds.</p>
        </div>

        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-medium">✔ Satisfaction Guarantee</h3>
          <p className="text-sm text-gray-600">
            We make sure you are happy with our quality services.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-medium">✔ 24×7 Support</h3>
          <p className="text-sm text-gray-600">
            We're here to help, anytime you need us.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
