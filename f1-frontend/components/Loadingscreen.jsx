import { useEffect, useRef } from "react"
import car from "../src/assets/transparent-image.png"

export default function LoadingScreen() {
  const sceneRef = useRef(null)

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const colors = [
      "#E8002D", "#ff3344", "#ff6644", "#ffaa44",
      "#ffdd88", "#ffffff", "#ff9900", "#ffcc44"
    ]

    const interval = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        const p = document.createElement("div")
        const size = 4 + Math.random() * 10
        const dur = 0.5 + Math.random() * 0.8
        const dx = -(70 + Math.random() * 80)
        const dy = Math.random() * 40 - 20
        const color = colors[Math.floor(Math.random() * colors.length)]
        const delay = Math.random() * 0.15

        p.style.cssText = `
          position: absolute;
          border-radius: 50%;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          left: 148px;
          bottom: 48px;
          opacity: 0;
          animation: drift ${dur}s linear ${delay}s forwards;
          --dx: ${dx}px;
          --dy: ${dy}px;
          pointer-events: none;
        `
        scene.appendChild(p)
        setTimeout(() => p?.remove(), (dur + delay) * 1000 + 100)
      }
    }, 60)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 200,
      background: "#050508",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "32px",
    }}>
      <style>{`
        @keyframes drift {
          0%   { opacity: 0.9; transform: translate(0, 0) scale(1); }
          100% { opacity: 0;   transform: translate(var(--dx), var(--dy)) scale(0.1); }
        }
        @keyframes carBob {
          from { transform: translateY(0px); }
          to   { transform: translateY(-4px); }
        }
        @keyframes fadeLabel {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.9; }
        }
        @keyframes dotPop {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.3); }
        }
        @keyframes trackScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      {/* scrolling track lines */}
      <div style={{
        position: "absolute",
        bottom: "calc(50% - 80px)",
        left: 0,
        right: 0,
        height: "2px",
        overflow: "hidden",
        opacity: 0.12,
      }}>
        <div style={{
          display: "flex",
          width: "200%",
          height: "100%",
          animation: "trackScroll 0.6s linear infinite",
        }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              width: "40px",
              height: "2px",
              background: i % 2 === 0 ? "white" : "transparent",
              flexShrink: 0,
            }} />
          ))}
        </div>
      </div>

      {/* car + particles */}
      <div ref={sceneRef} style={{
        position: "relative",
        width: "480px",
        height: "160px",
        animation: "carBob 0.4s ease-in-out infinite alternate",
      }}>
        <img
          src={car}
          alt="F1 Car"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 8px 24px rgba(232,0,45,0.35))",
          }}
        />
      </div>

      {/* label */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          animation: "fadeLabel 1.4s ease-in-out infinite",
        }}>
          Running simulations
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#E8002D",
              animation: `dotPop 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}