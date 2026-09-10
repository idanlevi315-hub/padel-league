import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "18",
    short_name: "18",
    description: "18 padel community Barcelona",
    start_url: "/",
    display: "standalone",
    background_color: "#eee9df",
    theme_color: "#5f6b64",
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
