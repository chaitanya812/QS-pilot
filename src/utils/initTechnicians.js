export const initTechnicians = () => {
  const forceReset = true; // 🔁 set false later

  if (forceReset || !localStorage.getItem("technicians")) {
    const techs = [
      { id: "tech1", name: "MS.Rao", phone: "9666027692" },
      { id: "tech2", name: "Mani", phone: "9502656351" },
      { id: "tech3", name: "Rohit", phone: "7013511894" },
      { id: "tech4", name: "Ramesh", phone: "9052327443" },
      { id: "tech5", name: "Chaitanya", phone: "7661045308" },
    ];

    localStorage.setItem("technicians", JSON.stringify(techs));
  }
};
