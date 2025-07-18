//export const lien = "http://localhost:4000/bboxx/b2b";
//export const lien_file = "http://localhost:4000/bboxx/b2b/file";

export const lien = "https://backendb2b.bboxxvm.com/bboxx/b2b";
export const lien_file = "https://backendb2b.bboxxvm.com/bboxx/b2b/file";
export const allpermission = [
  { id: 1, title: "Enregistrement des nouveaux projets", value: "01" },
  { id: 2, title: "Enregistrement des nouveaux Prospects", value: "02" },
  { id: 3, title: "Renseignement des nouvelles actions", value: "03" },
  { id: 4, title: "Modifier le projet", value: "04" },
  { id: 5, title: "Modifier le prospect", value: "05" },
];
export const config = {
  headers: {
    "Content-Type": "Application/json",
    Authorization: "Bearer " + localStorage.getItem("auth"),
  },
};
export const allstatus = [
  { id: 1, title: "En cours", value: "En cours" },
  { id: 2, title: "En pause", value: "En pause" },
  { id: 3, title: "Abandonner", value: "Abandonner" },
  { id: 4, title: "Cloturer", value: "clorurer" },
  { id: 4, title: "En attente", value: "En attente" },
];
