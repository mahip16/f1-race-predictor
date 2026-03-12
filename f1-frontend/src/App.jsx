import PredictionsSection from "../components/PredictionsSection"
import MonteCarloSection from "../components/MonteCarloSection"
import FeatureImportance from "../components/FeatureImportance"
import FormSection from "../components/FormSection"
import Hero from "../components/Hero"
import car from "./assets/car.webp"
import { useState } from "react"
import Sidebar from "../components/Sidebar"



export default function App() {
  

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

      <div style={{ position: "relative", zIndex: 1, padding: "40px", display: "flex", flexDirection: "column", gap: "40px" }}>
        <Hero />
        <PredictionsSection />
        <MonteCarloSection />
        <FormSection />
        <FeatureImportance />
      </div>

    </div>
  )
}