export default function Hero() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: "0 60px 80px",
      position: "relative",
    }}>

      {/* nav */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        padding: "36px 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "13px",
          letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
        }}>
          F1 Race Predictor
        </span>
        <div style={{ display: "flex", gap: "32px" }}>
          {["Predictions", "Monte Carlo", "Form", "Features"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} style={{
              color: "rgba(255,255,255,0.35)",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}>
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* main text */}
      <div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "11px",
          color: "#E8002D",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}>
          2025 Season — Monaco Grand Prix
        </div>

        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "clamp(64px, 9vw, 120px)",
          fontWeight: 800,
          lineHeight: 0.9,
          letterSpacing: "-0.02em",
          color: "#fff",
          margin: "0 0 32px",
          textTransform: "uppercase",
        }}>
          Win<br />
          <span style={{ color: "rgba(255,255,255,0.15)" }}>Predictions</span>
        </h1>

        {/* stat strip */}
        <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
          <div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "10px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}>
              Top Prediction
            </div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "22px",
              fontWeight: 700,
              color: "#FF8000",
            }}>
              Norris — 31.0%
            </div>
          </div>

          <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.1)" }} />

          <div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "10px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}>
              MC Simulations
            </div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "22px",
              fontWeight: 700,
              color: "#fff",
            }}>
              10,000
            </div>
          </div>

          <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.1)" }} />

          <div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "10px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}>
              Drivers Analyzed
            </div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "22px",
              fontWeight: 700,
              color: "#fff",
            }}>
              20
            </div>
          </div>
        </div>
      </div>

      {/* scroll indicator */}
      <div style={{
        position: "absolute",
        right: "60px",
        bottom: "80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "9px",
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          writingMode: "vertical-rl",
        }}>
          Scroll
        </div>
        <div style={{
          width: "1px",
          height: "60px",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)",
        }} />
      </div>

    </div>
  )
}