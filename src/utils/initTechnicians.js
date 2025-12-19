export const initTechnicians = () => {
  if (!localStorage.getItem("technicians")) {
    const techs = [
      { id: "tech1", name: "Ramesh", phone: "9052327443" },
      { id: "tech2", name: "Suresh", phone: "9000000002" },
      { id: "tech3", name: "Akhil", phone: "9000000003" },
      { id: "tech4", name: "Manoj", phone: "9000000004" },
      { id: "tech5", name: "Kiran", phone: "9000000005" },
    ];
    localStorage.setItem("technicians", JSON.stringify(techs));
  }
};
