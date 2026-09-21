import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../utils/CartContext";
import ViewCartBar from "../../components/ViewCartBar";

const SUPPORT_PHONE = "7661045308";

const BEAUTY_SECTIONS = [
  {
    title: "Popular Beauty Services",
    subtitle: "Most booked at home",
    items: [
      {
        id: "be1",
        name: "Home Salon - Haircut",
        price: 299,
        desc: "Professional haircut at your home",
        time: "45–60 min",
        warranty: "Service assurance",
      },
      {
        id: "be2",
        name: "Makeup at Home",
        price: 999,
        desc: "Professional makeup service at home",
        time: "90–120 min",
        warranty: "Service assurance",
      },
      {
        id: "be3",
        name: "Hair Styling",
        price: 499,
        desc: "Professional hair styling at home",
        time: "45–60 min",
        warranty: "Service assurance",
      },
      {
        id: "be4",
        name: "Hair Spa",
        price: 699,
        desc: "Relaxing hair spa treatment at home",
        time: "60–75 min",
        warranty: "Service assurance",
      },
    ],
  },
  {
    title: "Women’s Salon",
    subtitle: "Salon care at your doorstep",
    items: [
      {
        id: "be5",
        name: "Threading",
        price: 149,
        desc: "Eyebrow and facial threading service",
        time: "20–30 min",
        warranty: "Service assurance",
      },
      {
        id: "be6",
        name: "Facial",
        price: 599,
        desc: "Professional facial treatment at home",
        time: "45–60 min",
        warranty: "Service assurance",
      },
      {
        id: "be7",
        name: "Manicure",
        price: 399,
        desc: "Professional manicure at home",
        time: "40–50 min",
        warranty: "Service assurance",
      },
      {
        id: "be8",
        name: "Pedicure",
        price: 499,
        desc: "Professional pedicure at home",
        time: "45–60 min",
        warranty: "Service assurance",
      },
    ],
  },
  {
    title: "Men’s Grooming",
    subtitle: "Easy grooming at home",
    items: [
      {
        id: "be9",
        name: "Men's Haircut",
        price: 249,
        desc: "Professional men's haircut at home",
        time: "30–45 min",
        warranty: "Service assurance",
      },
      {
        id: "be10",
        name: "Beard Styling",
        price: 199,
        desc: "Beard trim and styling at home",
        time: "20–30 min",
        warranty: "Service assurance",
      },
      {
        id: "be11",
        name: "Haircut + Beard",
        price: 399,
        desc: "Complete haircut and beard grooming",
        time: "45–60 min",
        warranty: "Service assurance",
      },
      {
        id: "be12",
        name: "Men's Facial",
        price: 499,
        desc: "Professional facial treatment at home",
        time: "45–60 min",
        warranty: "Service assurance",
      },
    ],
  },
];

const QUICK_NEEDS = [
  {
    id: "haircut",
    icon: "✂️",
    title: "Need a Haircut?",
    search: "haircut",
  },
  {
    id: "makeup",
    icon: "💄",
    title: "Need Makeup?",
    search: "makeup",
  },
  {
    id: "facial",
    icon: "✨",
    title: "Need a Facial?",
    search: "facial",
  },
  {
    id: "grooming",
    icon: "🧔",
    title: "Need Grooming?",
    search: "groom",
  },
];

export default function BeautySalon() {
  const navigate = useNavigate();
  const { addItem, itemCount } = useCart();

  const [search, setSearch] = useState("");
  const [bookingId, setBookingId] = useState(null);

  const whatsappMessage = encodeURIComponent(
    "Hi QuickSeva, I need help with Beauty & Salon service."
  );

  const filteredSections = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return BEAUTY_SECTIONS;

    return BEAUTY_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.desc.toLowerCase().includes(query)
      ),
    })).filter((section) => section.items.length > 0);
  }, [search]);

  const handleBook = (section, item) => {
    if (bookingId) return;

    setBookingId(item.id);

    const cartItem = {
      id: item.id,
      key: item.id,
      label: item.name,
      name: item.name,
      price: Number(item.price),
      qty: 1,

      service: "Beauty & Salon",
      category: section.title,
      subService: item.name,

      description: item.desc,
      duration: item.time,
      warranty: item.warranty,
    };

    addItem(cartItem);

    // Give CartContext a moment to update before navigation.
    setTimeout(() => {
      navigate("/cart");
      setBookingId(null);
    }, 100);
  };

  const handleQuickNeed = (need) => {
    setSearch(need.search);

    setTimeout(() => {
      const element = document.getElementById("beauty-services");

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl"
            aria-label="Go back"
          >
            ←
          </button>

          <div className="flex-1">
            <p className="text-xs text-slate-500">QuickSeva</p>
            <h1 className="text-lg font-bold text-slate-900">
              Beauty & Salon
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="relative w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl"
            aria-label="Open cart"
          >
            🛒

            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        {/* HERO */}
        <section className="mt-4">
          <div
            className="relative min-h-[250px] rounded-3xl overflow-hidden shadow-lg"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=85)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/55" />

            <div className="relative z-10 min-h-[250px] p-5 sm:p-7 flex flex-col justify-between text-white">
              <div className="max-w-xl">
                <span className="inline-flex px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold backdrop-blur">
                  ✨ At-home beauty services
                </span>

                <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
                  Beauty care,
                  <br />
                  at your doorstep.
                </h2>

                <p className="text-sm sm:text-base text-white/85 mt-2">
                  Book trusted beauty and salon professionals without leaving
                  home.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`tel:+91${SUPPORT_PHONE}`}
                  className="px-4 py-2.5 bg-white text-slate-900 rounded-xl font-bold shadow"
                >
                  📞 Call Support
                </a>

                <a
                  href={`https://wa.me/91${SUPPORT_PHONE}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-green-500 text-white rounded-xl font-bold shadow"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH */}
        <section className="mt-5">
          <div className="bg-white border rounded-2xl p-3 shadow-sm flex items-center gap-3">
            <span className="text-xl">🔎</span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="What beauty service do you need?"
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-slate-400 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </section>

        {/* QUICK NEEDS */}
        <section className="mt-6">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                What do you need?
              </h2>
              <p className="text-sm text-slate-500">
                Choose your need and book in seconds
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_NEEDS.map((need) => (
              <button
                key={need.id}
                type="button"
                onClick={() => handleQuickNeed(need)}
                className="bg-white border rounded-2xl p-4 text-left hover:shadow-md transition active:scale-[0.98]"
              >
                <div className="w-11 h-11 rounded-xl bg-pink-50 flex items-center justify-center text-2xl">
                  {need.icon}
                </div>

                <p className="font-bold text-slate-900 mt-3 text-sm">
                  {need.title}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  View services →
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="grid grid-cols-3 gap-2 mt-5">
          <div className="bg-white border rounded-xl p-3 text-center">
            <div className="text-xl">👩‍💼</div>
            <p className="text-xs font-semibold text-slate-700 mt-1">
              At Home
            </p>
          </div>

          <div className="bg-white border rounded-xl p-3 text-center">
            <div className="text-xl">🛡️</div>
            <p className="text-xs font-semibold text-slate-700 mt-1">
              Verified
            </p>
          </div>

          <div className="bg-white border rounded-xl p-3 text-center">
            <div className="text-xl">💰</div>
            <p className="text-xs font-semibold text-slate-700 mt-1">
              Clear Price
            </p>
          </div>
        </section>

        {/* SERVICES */}
        <section id="beauty-services" className="mt-7 scroll-mt-24">
          {filteredSections.length === 0 ? (
            <div className="bg-white border rounded-3xl p-8 text-center">
              <div className="text-5xl">🔎</div>

              <h3 className="text-lg font-bold text-slate-900 mt-3">
                No service found
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Try searching for haircut, makeup, facial or grooming.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-bold"
              >
                Show All Services
              </button>
            </div>
          ) : (
            filteredSections.map((section) => (
              <div key={section.title} className="mb-8">
                <div className="mb-3">
                  <h2 className="text-xl font-bold text-slate-900">
                    {section.title}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {section.subtitle}
                  </p>
                </div>

                <div className="grid gap-3">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="w-11 h-11 shrink-0 rounded-xl bg-pink-50 flex items-center justify-center text-xl">
                              ✨
                            </div>

                            <div>
                              <h3 className="font-bold text-slate-900">
                                {item.name}
                              </h3>

                              <p className="text-sm text-slate-500 mt-1">
                                {item.desc}
                              </p>

                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                                  ⏱ {item.time}
                                </span>

                                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg">
                                  ✓ {item.warranty}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="sm:text-right sm:min-w-[130px]">
                          <div className="text-xl font-extrabold text-slate-900">
                            ₹{Number(item.price).toLocaleString("en-IN")}
                          </div>

                          <p className="text-xs text-slate-400 mt-1">
                            Starting price
                          </p>

                          <button
                            type="button"
                            disabled={bookingId === item.id}
                            onClick={() => handleBook(section, item)}
                            className={`mt-3 w-full sm:w-auto px-5 py-2.5 rounded-xl text-white font-bold shadow-sm transition ${
                              bookingId === item.id
                                ? "bg-slate-400 cursor-wait"
                                : "bg-sky-500 hover:bg-sky-600 active:scale-[0.98]"
                            }`}
                          >
                            {bookingId === item.id
                              ? "Adding..."
                              : "Book Now →"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-8">
          <div className="bg-white border rounded-3xl p-5">
            <h2 className="text-xl font-bold text-slate-900">
              How QuickSeva works
            </h2>

            <div className="grid sm:grid-cols-3 gap-4 mt-5">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-xl">
                  1️⃣
                </div>
                <h3 className="font-bold mt-2">Choose a service</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select the beauty service you need.
                </p>
              </div>

              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-xl">
                  2️⃣
                </div>
                <h3 className="font-bold mt-2">Choose date & time</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tell us where and when you need the service.
                </p>
              </div>

              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-xl">
                  3️⃣
                </div>
                <h3 className="font-bold mt-2">Relax at home</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your service professional comes to you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SUPPORT */}
        <section className="mt-5">
          <div className="rounded-3xl bg-slate-900 text-white p-5">
            <p className="text-xs text-slate-300">Need help?</p>

            <h2 className="text-xl font-bold mt-1">
              Not sure which service you need?
            </h2>

            <p className="text-sm text-slate-300 mt-2">
              Talk to QuickSeva support and we will help you choose.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <a
                href={`tel:+91${SUPPORT_PHONE}`}
                className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold"
              >
                📞 Call
              </a>

              <a
                href={`https://wa.me/91${SUPPORT_PHONE}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-green-500 text-white font-bold"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <ViewCartBar />
    </div>
  );
}