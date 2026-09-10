import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#eee9df",
        color: "#5f6b64",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: 170, fontWeight: 700, letterSpacing: -12 }}>18</div>
        <div style={{ marginTop: 18, fontSize: 34, fontWeight: 600, letterSpacing: 2 }}>
          PADEL COMMUNITY · BARCELONA
        </div>
      </div>
    </div>,
    size
  );
}
