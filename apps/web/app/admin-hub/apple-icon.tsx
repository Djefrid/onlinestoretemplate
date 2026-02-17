import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AdminAppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F172A",
          borderRadius: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            borderRadius: 20,
            border: "4px solid #3B82F6",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "sans-serif",
              fontSize: 44,
              fontWeight: 700,
              color: "#3B82F6",
              letterSpacing: "-2px",
            }}
          >
            AH
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
