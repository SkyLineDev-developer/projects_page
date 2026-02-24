export interface Project {
  id: string;
  name: string;
  domain: string;
  deploymentUrl: string;
  lastCommit: string;
  commitHash?: string;
  updatedAt: string;
  branch?: string;
  status?: "ready" | "building" | "error";
  team?: string;
  icon?: string;
  image?: string;
}

export const projects: Project[] = [
  {
    id: "restaurant-template",
    name: "restaurant-template",
    domain: "www.restaurant-template.skylinedev.com.co",
    deploymentUrl: "restaurant-template-cj4skt67g-sky-line-dev.vercel.app",
    lastCommit: "primer commit",
    commitHash: "9c80d22",
    updatedAt: "24h ago",
    branch: "main",
    status: "ready",
    team: "SkyLineDev-developer",
    image: "/img/restaurant_template.png",
  },
  {
    id: "sky-line-dev",
    name: "sky-line-dev",
    domain: "www.skylinedev.com.co",
    deploymentUrl: "sky-line-dev-git-main-sky-line-dev.vercel.app",
    lastCommit: "actualizacion de proyecto",
    commitHash: "a3f91bc",
    updatedAt: "Feb 18",
    branch: "main",
    status: "ready",
    team: "SkyLineDev-developer",
    image: "/img/sky_line_dev.png",
  },
  {
    id: "av-vitrales",
    name: "av-vitrales",
    domain: "www.av-vitrales.skylinedev.com.co",
    deploymentUrl: "av-vitrales-git-main-sky-line-dev.vercel.app",
    lastCommit: "cambios",
    commitHash: "d72e44f",
    updatedAt: "8/2/25",
    branch: "main",
    status: "ready",
    team: "SkyLineDev-developer",
    image: "/img/av_vitrales.png",
  },
];