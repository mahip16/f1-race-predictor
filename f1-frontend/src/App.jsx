import PredictionsSection from "../components/PredictionsSection"
import MonteCarloSection from "../components/MonteCarloSection"
import FeatureImportance from "../components/FeatureImportance"
import FormSection from "../components/FormSection"
import Hero from "../components/Hero"
import car from "./assets/car.webp"
import { useState } from "react"
import Sidebar from "../components/Sidebar"


export default function App() {
    const [predictions, setPredictions] = useState(null)
    const [loading, setLoading] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [form, setForm] = useState(null)

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
          opacity: 0.9,
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
        onForm={setForm} />
      
      <div style={{ position: "relative", 
                    zIndex: 1, padding: "40px", 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "40px", 
                    opacity: loading ? 0 : 1, 
                    transition: "opacity 0.4s ease", }}>
        <Hero predictions={predictions}/>
        <PredictionsSection key={predictions?.circuit + predictions?.season} predictions={predictions} />
        <MonteCarloSection key={"mc" + predictions?.circuit + predictions?.season} predictions={predictions} />
        <FormSection />
        <FeatureImportance />
      </div>
    </div>
  )
}