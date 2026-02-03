import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (!u) {
      navigate("/login");
      return;
    }

    setUser(u);
    setName(u.name || "");
    setPhoto(u.photo || "");

    setTimeout(() => setLoading(false), 900);
  }, [navigate]);

  const handlePhoto = (e) => {
    if (!isEditing) return;

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
      setIsChanged(true);
    };
    reader.readAsDataURL(file);
  };

  const handleMainButton = () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const updated = { ...user, name, photo };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);

    setIsEditing(false);
    setIsChanged(false);

    alert("Profile updated successfully");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="p-4 pb-28">
        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto animate-pulse" />
        <div className="h-4 bg-gray-300 rounded w-36 mx-auto mt-4 animate-pulse" />
        <div className="h-10 bg-gray-300 rounded-xl mt-6 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-4 pb-28">
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded bg-qsGray-light"
      >
        ← Back
      </button>

      <h2 className="mt-4 font-semibold">My Profile</h2>

      {/* Profile Photo */}
      <div className="flex flex-col items-center mt-4">
        <img
          src={photo || user.photo || "https://i.pravatar.cc/150"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />

        <label
          className={`mt-2 px-3 py-2 rounded cursor-pointer
            ${isEditing ? "bg-qsGray-light" : "bg-gray-200 cursor-not-allowed"}`}
        >
          Change Photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhoto}
            disabled={!isEditing}
          />
        </label>
      </div>

      {/* Name */}
      <div className="mt-4">
        <label className="block text-sm mb-1">Name</label>
        <input
          disabled={!isEditing}
          className={`w-full p-3 rounded-qs border
            ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setIsChanged(true);
          }}
        />
      </div>

      {/* Phone */}
      <div className="mt-4">
        <label className="block text-sm mb-1">Phone</label>
        <input
          disabled
          className="w-full p-3 rounded-qs border bg-gray-100"
          value={user.phone || ""}
        />
      </div>

      {/* Change / Save Button */}
      <button
        onClick={handleMainButton}
        disabled={isEditing && !isChanged}
        className={`w-full mt-4 p-3 rounded-qs text-white
          ${
            !isEditing
              ? "bg-qsBlue-500"
              : isChanged
              ? "bg-qsBlue-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
      >
        {!isEditing ? "Change Details" : "Save Changes"}
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full mt-6 p-3 rounded-qs border border-red-500 text-red-500"
      >
        Logout
      </button>
    </div>
  );
}
