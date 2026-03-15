import PredictionsSection from "../components/PredictionsSection"
import MonteCarloSection from "../components/MonteCarloSection"
import FeatureImportance from "../components/FeatureImportance"
import Hero from "../components/Hero"
import car from "./assets/car.webp"
import { useState, useEffect, useRef } from "react"
import Sidebar from "../components/Sidebar"
import ModelFeaturesSection from "../components/ModelFeaturesSection"
import car2 from "./assets/transparent-image.png"
import "./index.css"

export default function App() {
    const [predictions, setPredictions] = useState(null)
    const [loading, setLoading] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)

    const handleResults = (data) => {
      setPredictions(null)  
      setTimeout(() => setPredictions(data), 50)  
    }

  return (
    <div style={{ background: "#050508", minHeight: "100vh" }}>
  
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}>
        <img src={car} alt="" style={{
          position: "absolute",
          bottom: "-5%",
          right: "-5%",
          width: "85%",
          opacity: loading ? 0.15 : 0.9,
          maskImage: "linear-gradient(to left, rgba(0,0,0,0.8), transparent 90%)",
          WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.8), transparent 90%)",
        }} />
      </div>

      <button onClick={() => setDrawerOpen(!drawerOpen)} style={{
        position: "fixed",
        top: "36px",
        left: "36px",
        zIndex: 100,
        background: "none",
        border: "none",
        cursor: "pointer",
        display: drawerOpen ? "none" : "flex",
        flexDirection: "column",
        gap: "5px",
        padding: "8px",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: "24px",
            height: "2px",
            background: "rgba(255,255,255,0.6)",
            borderRadius: "2px",
          }} />
        ))}
      </button>

      <Sidebar 
        onResults={handleResults} 
        setLoading={setLoading} 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
       />
      
      <div style={{ position: "relative", zIndex: 1, padding: "40px", display: "flex", flexDirection: "column", gap: "40px" }}>
        {!loading && <Hero predictions={predictions}/>}
        {loading && <InlineLoader carImg={car2} />}
        <div style={{ opacity: loading ? 0 : 1, transition: "opacity 0.4s ease", display: "flex", flexDirection: "column", gap: "40px" }}>
        <div id="predictions"><PredictionsSection key={predictions?.circuit + predictions?.season} predictions={predictions} /></div>
        <div id="monte-carlo"><MonteCarloSection key={"mc" + predictions?.circuit + predictions?.season} predictions={predictions} /></div>
        <div id="model-features"><ModelFeaturesSection key={"features" + predictions?.circuit + predictions?.season} predictions={predictions} /></div>
        <div id="features"><FeatureImportance key={predictions?.circuit + predictions?.season} /></div>
    </div>
    </div>
  </div>
  )
}

function InlineLoader( {carImg} ) {
  const sceneRef = useRef(null)

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    const colors = ["#E8002D","#ff3344","#ff6644","#ffaa44","#fff","#ff9900"]
    const interval = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        const p = document.createElement("div")
        const size = 3 + Math.random() * 7
        const dur = 0.5 + Math.random() * 0.7
        const dx = -(50 + Math.random() * 60)
        const dy = Math.random() * 30 - 15
        const color = colors[Math.floor(Math.random() * colors.length)]
        p.style.cssText = `
          position:absolute; border-radius:50%;
          width:${size}px; height:${size}px;
          background:${color};
          left:30px; bottom:50px;
          opacity:0; pointer-events:none;
          animation:drift ${dur}s linear ${Math.random()*0.15}s forwards;
          --dx:${dx}px; --dy:${dy}px;
        `
        scene.appendChild(p)
        setTimeout(() => p?.remove(), (dur + 0.2) * 1000)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
      padding: "70vh",
    }}>
      <style>{`
        @keyframes drift {
          0%   { opacity: 0.9; transform: translate(0,0) scale(1); }
          100% { opacity: 0;   transform: translate(var(--dx),var(--dy)) scale(0.1); }
        }
        @keyframes carBob {
          from { transform: translateY(0); }
          to   { transform: translateY(-4px); }
        }
        @keyframes fadeLabel {
          0%,100% { opacity:0.3; } 50% { opacity:0.9; }
        }
        @keyframes dotPop {
          0%,100% { opacity:0.2; transform:scale(0.8); }
          50% { opacity:1; transform:scale(1.3); }
        }
      `}</style>

      <div ref={sceneRef} style={{
        position: "relative",
        width: "220px",
        height: "80px",
        animation: "carBob 0.4s ease-in-out infinite alternate",
      }}>
        <img src={carImg} alt="" style={{
          position: "absolute",
          bottom: 0, left: 0,
          width: "100%",
          filter: "drop-shadow(0 6px 18px rgba(232,0,45,0.4))",
        }} />
      </div>

      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"8px" }}>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          animation: "fadeLabel 1.4s ease-in-out infinite",
        }}>Running simulations</span>
        <div style={{ display:"flex", gap:"6px" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width:"4px", height:"4px", borderRadius:"50%",
              background:"#E8002D",
              animation:`dotPop 1.2s ease-in-out ${i*0.2}s infinite`,
            }}/>
          ))}
        </div>
      </div>
    </div>
  )
}