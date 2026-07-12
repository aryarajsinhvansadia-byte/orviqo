import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "ORVIQO — The quiet kind of famous. Websites, brands & AI.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0a0a10",
          padding: "80px 96px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 48,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: "#ff8b3d",
                boxShadow: "0 0 24px 6px rgba(255,139,61,0.6)",
              }}
            />
            <div
              style={{
                color: "#eae8e3",
                fontSize: 34,
                letterSpacing: 10,
                fontWeight: 600,
              }}
            >
              ORVIQO
            </div>
          </div>
          <div
            style={{
              color: "#eae8e3",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 640,
            }}
          >
            The quiet kind of famous.
          </div>
          <div
            style={{
              color: "#8f8e96",
              fontSize: 28,
              marginTop: 36,
              maxWidth: 560,
              lineHeight: 1.4,
            }}
          >
            Websites, brands & AI systems for ambitious companies worldwide.
          </div>
        </div>
        <div
          style={{
            width: 340,
            height: 340,
            borderRadius: 999,
            background: "#0c0c13",
            boxShadow:
              "0 0 60px 10px rgba(255,160,90,0.55), 0 0 160px 40px rgba(255,139,61,0.25), inset 0 0 60px 10px rgba(255,180,110,0.3)",
          }}
        />
      </div>
    ),
    size
  );
}
