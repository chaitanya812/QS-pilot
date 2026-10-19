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
    const u = JSON.parse(
      localStorage.getItem("user") || "null"
    );

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

    const updated = {
      ...user,
      name,
      photo,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updated)
    );

    setUser(updated);

    setIsEditing(false);
    setIsChanged(false);

    alert("Profile updated successfully");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div
        className="min-h-screen p-4 pb-28"
        style={{
          backgroundColor: "#F1F5F9",
        }}
      >
        <div className="max-w-md mx-auto">

          <div className="h-10 w-24 bg-white rounded-xl animate-pulse" />

          <div className="w-24 h-24 bg-[#CBD5E1] rounded-full mx-auto mt-8 animate-pulse" />

          <div className="h-4 bg-[#CBD5E1] rounded w-36 mx-auto mt-4 animate-pulse" />

          <div className="h-12 bg-white rounded-2xl mt-6 animate-pulse" />

          <div className="h-12 bg-white rounded-2xl mt-4 animate-pulse" />

          <div className="h-12 bg-white rounded-2xl mt-4 animate-pulse" />

        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 pb-28"
      style={{
        backgroundColor: "#F1F5F9",
      }}
    >

      <div className="max-w-md mx-auto">

        {/* =========================
            HEADER
        ========================= */}

        <div
          className="rounded-b-3xl -mx-4 -mt-4 px-4 py-4 shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, #0B1D36 0%, #0D9488 100%)",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl bg-white font-semibold transition hover:scale-[1.02]"
            style={{
              color: "#0B1D36",
            }}
          >
            ← Back
          </button>
        </div>

        {/* =========================
            TITLE
        ========================= */}

        <div className="mt-6">

          <h2
            className="text-2xl font-bold"
            style={{
              color: "#0B1D36",
            }}
          >
            My Profile
          </h2>

          <p
            className="text-sm mt-1"
            style={{
              color: "#64748B",
            }}
          >
            Manage your personal information
          </p>

        </div>

        {/* =========================
            PROFILE CARD
        ========================= */}

        <div
          className="mt-6 rounded-3xl p-6 shadow-sm"
          style={{
            backgroundColor: "#F8FAFC",
            border: "1px solid #E2E8F0",
          }}
        >

          {/* Profile Photo */}

          <div className="flex flex-col items-center">

            <div
              className="w-28 h-28 rounded-full p-1 shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, #0D9488, #0EA5E9)",
              }}
            >
              <img
                src={
                  photo ||
                  user.photo ||
                  "https://i.pravatar.cc/150"
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-white"
              />
            </div>

            {/* Change Photo */}

            <label
              className={`mt-4 px-5 py-2.5 rounded-full font-semibold transition ${
                isEditing
                  ? "cursor-pointer hover:scale-[1.02]"
                  : "cursor-not-allowed"
              }`}
              style={{
                backgroundColor: isEditing
                  ? "#E6FFFB"
                  : "#E2E8F0",
                color: isEditing
                  ? "#0D9488"
                  : "#94A3B8",
                border: isEditing
                  ? "1px solid #99F6E4"
                  : "1px solid #CBD5E1",
              }}
            >
              {isEditing
                ? "📷 Change Photo"
                : "🔒 Change Photo"}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhoto}
                disabled={!isEditing}
              />
            </label>

          </div>

          {/* =========================
              NAME
          ========================= */}

          <div className="mt-7">

            <label
              className="block text-sm font-semibold mb-2"
              style={{
                color: "#0B1D36",
              }}
            >
              Name
            </label>

            <input
              disabled={!isEditing}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsChanged(true);
              }}
              placeholder="Enter your name"
              className="w-full p-3.5 rounded-2xl outline-none transition"
              style={{
                backgroundColor: isEditing
                  ? "#FFFFFF"
                  : "#F1F5F9",
                border: isEditing
                  ? "1px solid #0D9488"
                  : "1px solid #E2E8F0",
                color: "#0F172A",
              }}
            />

          </div>

          {/* =========================
              PHONE
          ========================= */}

          <div className="mt-5">

            <label
              className="block text-sm font-semibold mb-2"
              style={{
                color: "#0B1D36",
              }}
            >
              Phone Number
            </label>

            <div
              className="flex items-center rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "#F1F5F9",
                border: "1px solid #E2E8F0",
              }}
            >

              <div
                className="px-4 py-3.5 font-bold"
                style={{
                  color: "#0D9488",
                  borderRight:
                    "1px solid #E2E8F0",
                }}
              >
                +91
              </div>

              <input
                disabled
                value={
                  user.phone
                    ? String(user.phone).replace(
                        /^\+91/,
                        ""
                      )
                    : ""
                }
                className="flex-1 p-3.5 bg-transparent outline-none text-[#475569]"
              />

            </div>

            <p
              className="text-xs mt-2"
              style={{
                color: "#94A3B8",
              }}
            >
              Phone number cannot be changed.
            </p>

          </div>

          {/* =========================
              CHANGE / SAVE
          ========================= */}

          <button
            onClick={handleMainButton}
            disabled={
              isEditing && !isChanged
            }
            className="w-full mt-6 p-3.5 rounded-2xl text-white font-bold shadow-lg transition-all duration-300"
            style={{
              background:
                !isEditing || isChanged
                  ? "linear-gradient(90deg, #0D9488 0%, #0EA5E9 100%)"
                  : "#94A3B8",
              cursor:
                isEditing && !isChanged
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {!isEditing
              ? "✏️ Change Details"
              : isChanged
              ? "✓ Save Changes"
              : "No Changes to Save"}
          </button>

        </div>

        {/* =========================
            ACCOUNT INFO
        ========================= */}

        <div
          className="mt-5 rounded-3xl p-5"
          style={{
            background:
              "linear-gradient(135deg, #E6FFFB 0%, #EFF6FF 100%)",
            border: "1px solid #BAE6FD",
          }}
        >

          <div className="flex items-center gap-3">

            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
              style={{
                backgroundColor: "#0D9488",
              }}
            >
              👤
            </div>

            <div>

              <p
                className="font-bold"
                style={{
                  color: "#0B1D36",
                }}
              >
                Account Information
              </p>

              <p
                className="text-xs mt-1"
                style={{
                  color: "#64748B",
                }}
              >
                Your profile details are stored securely on this device.
              </p>

            </div>

          </div>

        </div>

        {/* =========================
            LOGOUT
        ========================= */}

        <button
          onClick={handleLogout}
          className="w-full mt-6 p-3.5 rounded-2xl font-bold transition"
          style={{
            backgroundColor: "#FFF1F2",
            border: "1px solid #FECDD3",
            color: "#E11D48",
          }}
        >
          🚪 Logout
        </button>

      </div>
    </div>
  );
}
