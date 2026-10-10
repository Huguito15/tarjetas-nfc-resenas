import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name}: tarjetas NFC para conseguir reseñas de Google`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function Mark({ size: s }: { size: number }) {
  return (
    <div
      style={{
        width: s,
        height: s,
        borderRadius: s * 0.28,
        backgroundImage: "linear-gradient(135deg, #3b82ff, #1638b8)",
        display: "flex",
      }}
    >
      <svg width={s} height={s} viewBox="0 0 32 32">
        <circle cx="10" cy="16" r="2.4" fill="#fff" />
        <path d="M15 11.5a6.4 6.4 0 0 1 0 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M19.6 8.2a11 11 0 0 1 0 15.6" stroke="#fff" strokeOpacity="0.75" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M24.2 5a15.6 15.6 0 0 1 0 22" stroke="#fff" strokeOpacity="0.45" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#fff",
          backgroundColor: "#03050b",
          backgroundImage:
            "radial-gradient(circle at 82% 18%, rgba(59,130,255,0.55) 0%, rgba(10,20,48,0.6) 32%, rgba(3,5,11,0) 62%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 32, fontWeight: 600 }}>
          <Mark size={56} />
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.04, letterSpacing: "-0.03em" }}>Más reseñas.</div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.04, letterSpacing: "-0.03em" }}>Más confianza.</div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.04, letterSpacing: "-0.03em", color: "#7fb2ff" }}>
            Más clientes.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "rgba(255,255,255,0.72)" }}>
            Tarjetas NFC para reseñas de Google · Estándar 30 € · Personalizada 40 €
          </div>
        </div>
      </div>
    ),
    size,
  );
}
