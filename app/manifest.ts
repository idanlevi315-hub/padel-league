import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EQUIPO",
    short_name: "EQUIPO",
    description: "EQUIPO padel league",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f2ea",
    theme_color: "#0b2638",
    orientation: "portrait",
    icons: [
      {
        src: "/equipo-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/equipo-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
