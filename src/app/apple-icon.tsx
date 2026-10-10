import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(135deg, #3b82ff, #1638b8)",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 32 32">
          <circle cx="10" cy="16" r="2.4" fill="#fff" />
          <path d="M15 11.5a6.4 6.4 0 0 1 0 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M19.6 8.2a11 11 0 0 1 0 15.6" stroke="#fff" strokeOpacity="0.75" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M24.2 5a15.6 15.6 0 0 1 0 22" stroke="#fff" strokeOpacity="0.45" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    ),
    size,
  );
}
