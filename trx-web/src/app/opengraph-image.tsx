import { ImageResponse } from "next/og";

export const alt = "TRX - Terminal Package Manager";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0b0b0b",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Logo pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#161616",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "10px 18px",
              boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "28px",
                fontWeight: "700",
                color: "#ebebeb",
                letterSpacing: "-0.02em",
              }}
            >
              [<span style={{ color: "#5d9960" }}>trx-cli</span>]
            </span>
          </div>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#5d9960",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "14px",
              color: "#505050",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            v0.1.0 · MIT · Rust
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "820px",
          }}
        >
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: "64px",
              fontWeight: "700",
              color: "#ebebeb",
              lineHeight: "1.1",
              letterSpacing: "-0.03em",
            }}
          >
            The package manager
            <br />
            <span style={{ color: "#5d9960" }}>for the terminal generation.</span>
          </span>
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: "22px",
              color: "#878787",
              lineHeight: "1.5",
              maxWidth: "640px",
            }}
          >
            Fuzzy search 50,000+ packages in under 50ms. Runs on macOS, Arch Linux, and Debian/Ubuntu.
          </span>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "24px" }}>
            {["macOS", "Arch Linux", "Debian / Ubuntu"].map((p) => (
              <span
                key={p}
                style={{
                  fontFamily: "monospace",
                  fontSize: "13px",
                  color: "#505050",
                }}
              >
                {p}
              </span>
            ))}
          </div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "14px",
              color: "#505050",
            }}
          >
            trx.pidev.tech
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
