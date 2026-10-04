// src/data/members.ts
// Canonical member data for NCD — single source of truth
// Matches the official NCD member list (15 members, 3 teams, 3 divisions, 2 leadership)

export interface Member {
  name: string;
  npm: string;
  team: "Team 1" | "Team 2" | "Team 3";
  division: "People & Culture" | "Competition & Strategy" | "Project & Development" | "Not Assigned";
  role: "Chairperson — Period I" | "Vice Chairperson — Period I" | "Division Lead" | "Member";
  image: string;
  email: string;
}

export const members: Member[] = [
  // Team 1
  {
    name: "Dian Aulia Febrianti",
    npm: "10225457",
    team: "Team 1",
    division: "Not Assigned",
    role: "Member",
    image: "/images/dian-aulia-febrianti.png",
    email: "dian.aulia@ncd.id",
  },
  {
    name: "Muhamad Fauzan Al Farikhi",
    npm: "50425672",
    team: "Team 1",
    division: "Not Assigned",
    role: "Vice Chairperson — Period I",
    image: "/images/muhamad-fauzan-al-farikhi.png",
    email: "muhamad.fauzan@ncd.id",
  },
  {
    name: "Mirza Danisywar Noor Wahyu",
    npm: "50425631",
    team: "Team 1",
    division: "Not Assigned",
    role: "Chairperson — Period I",
    image: "/images/mirza-danisywar-noor-wahyu.png",
    email: "mirza.danisywar@ncd.id",
  },
  {
    name: "Syawalludin Fitroh Rahman",
    npm: "51425248",
    team: "Team 1",
    division: "Not Assigned",
    role: "Member",
    image: "/images/syawalludin-fitroh-rahman.png",
    email: "syawalludin.fitroh@ncd.id",
  },
  {
    name: "Annisa Saskia",
    npm: "50425134",
    team: "Team 1",
    division: "Not Assigned",
    role: "Member",
    image: "/images/annisa-saskia.png",
    email: "annisa.saskia@ncd.id",
  },

  // Team 2
  {
    name: "Mochamad Triandra Andantyo",
    npm: "50425637",
    team: "Team 2",
    division: "Not Assigned",
    role: "Member",
    image: "/images/mochamad-triandra-andantyo.png",
    email: "mochamad.triandra@ncd.id",
  },
  {
    name: "Ghazali Syaqih Husein",
    npm: "10125379",
    team: "Team 2",
    division: "Not Assigned",
    role: "Member",
    image: "/images/ghazali-syaqih-husein.png",
    email: "ghazali.syaqih@ncd.id",
  },
  {
    name: "Putri Aura Wening",
    npm: "50425998",
    team: "Team 2",
    division: "Not Assigned",
    role: "Member",
    image: "/images/putri-aura-wening.png",
    email: "putri.aura@ncd.id",
  },
  {
    name: "Muhammad Iqbal Fajri",
    npm: "50425788",
    team: "Team 2",
    division: "Not Assigned",
    role: "Member",
    image: "/images/muhammad-iqbal-fajri.png",
    email: "muhammad.iqbal@ncd.id",
  },
  {
    name: "Chantika Shinta Sonia",
    npm: "10225359",
    team: "Team 2",
    division: "Not Assigned",
    role: "Member",
    image: "/images/chantika-shinta-sonia.png",
    email: "chantika.shinta@ncd.id",
  },

  // Team 3
  {
    name: "Deryl Jonathan Yofan",
    npm: "50425267",
    team: "Team 3",
    division: "Not Assigned",
    role: "Member",
    image: "/images/deryl-jonathan-yofan.png",
    email: "deryl.jonathan@ncd.id",
  },
  {
    name: "Rayyan Fathan Addani",
    npm: "51425098",
    team: "Team 3",
    division: "Not Assigned",
    role: "Member",
    image: "/images/rayyan-fathan-addani.png",
    email: "rayyan.fathan@ncd.id",
  },
  {
    name: "Nedri Febrianto",
    npm: "50425955",
    team: "Team 3",
    division: "Not Assigned",
    role: "Member",
    image: "/images/nedri-febrianto.png",
    email: "nedri.febrianto@ncd.id",
  },
  {
    name: "Sri Gunarti Wijiastuti",
    npm: "51425231",
    team: "Team 3",
    division: "Not Assigned",
    role: "Member",
    image: "/images/sri-gunarti-wijiastuti.png",
    email: "sri.gunarti@ncd.id",
  },
  {
    name: "Sheva Putra Firdaus",
    npm: "51425218",
    team: "Team 3",
    division: "Not Assigned",
    role: "Member",
    image: "/images/sheva-putra-firdaus.png",
    email: "sheva.putra@ncd.id",
  },
];

export const leadership = members.filter(
  (m) => m.role === "Chairperson — Period I" || m.role === "Vice Chairperson — Period I"
);

export const teams = {
  "Team 1": members.filter((m) => m.team === "Team 1"),
  "Team 2": members.filter((m) => m.team === "Team 2"),
  "Team 3": members.filter((m) => m.team === "Team 3"),
};

export const divisions = {
  "People & Culture": members.filter((m) => m.division === "People & Culture"),
  "Competition & Strategy": members.filter((m) => m.division === "Competition & Strategy"),
  "Project & Development": members.filter((m) => m.division === "Project & Development"),
  "Not Assigned": members.filter((m) => m.division === "Not Assigned"),
};

export function getMemberByName(name: string): Member | undefined {
  return members.find((m) => m.name === name);
}

export function getMemberByEmail(email: string): Member | undefined {
  return members.find((m) => m.email === email);
}

export function getMembersByTeam(team: "Team 1" | "Team 2" | "Team 3"): Member[] {
  return members.filter((m) => m.team === team);
}

export function getMembersByDivision(division: Member["division"]): Member[] {
  return members.filter((m) => m.division === division);
}

export const placeholderImage = "/images/placeholder-member.png";