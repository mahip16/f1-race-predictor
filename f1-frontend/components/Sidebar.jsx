import { useState, useEffect } from "react"
import { fetchSeasons, fetchRaces, fetchPredictions } from "../src/api"
import { MOCK_PREDICTIONS } from "../src/mockData"

const DRIVERS_2026 = [
  "norris", "piastri", "leclerc", "hamilton", "russell",
  "antonelli", "max_verstappen", "lawson", "alonso", "stroll",
  "ocon", "gasly", "hulkenberg", "bortoleto", "sainz",
  "albon", "colapinto", "bearman", "hadjar", "doohan"
]

export default function Sidebar({ onResults, setLoading, isOpen, onClose }) {
  const [mode, setMode] = useState("historical")
  const [seasons, setSeasons] = useState([])
  const [season, setSeason] = useState(2025)
  const [races, setRaces] = useState([])
  const [selectedCircuit, setSelectedCircuit] = useState(null)
  const [grid, setGrid] = useState(Array(20).fill(""))

  // fetch seasons on mount
  useEffect(() => {
    fetchSeasons().then(data => setSeasons(data.seasons))
  }, [])

  // fetch races when season changes
  useEffect(() => {
    fetchRaces(season).then(data => setRaces(data.races))
    setSelectedCircuit(null)
  }, [season])

  const handleSubmit = async () => {
    if (mode === "historical" && !selectedCircuit) return
    onClose()
    setLoading(true)
    try {
      const data = await fetchPredictions(season, selectedCircuit)
      onResults(data)
    } catch {
      onResults(MOCK_PREDICTIONS)
    } finally {
      setTimeout(() => setLoading(false), 400)
    }
  }

  return (
    <>
      {isOpen && (
        <div onClick={onClose} style={{
          position: "fixed",
          inset: 0,
          zIndex: 98,
          background: "rgba(0,0,0,0.4)",
        }} />
      )}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "calc(100vh - 48px)",
        width: "280px",
        zIndex: 99,
        background: "rgba(5,5,8,0.97)",
        backdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        padding: "36px 20px 40px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        overflow: "hidden",
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {/* scrollable content */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}>

      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: "12px",
        letterSpacing: "0.3em",
        color: "rgba(255,255,255,0.25)",
        textTransform: "uppercase",
        }}>
          F1 Predictor
        </span>
        <button onClick={onClose} style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.3)",
          cursor: "pointer",
          fontSize: "20px",
          lineHeight: 1,
          padding: 0,
        }}>✕</button>
      </div>

      {/* mode toggle */}
      <div>
        <Label>Mode</Label>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          {["historical", "2026"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1,
              padding: "8px 0",
              background: mode === m ? "#E8002D" : "rgba(255,255,255,0.05)",
              border: "1px solid",
              borderColor: mode === m ? "#E8002D" : "rgba(255,255,255,0.08)",
              borderRadius: "8px",
              color: mode === m ? "#fff" : "rgba(255,255,255,0.4)",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}>
              {m === "historical" ? "Historical" : "2026"}
            </button>
          ))}
        </div>
      </div>

      {mode === "historical" && (
        <>
          {/* season dropdown */}
          <div>
            <Label>Season</Label>
            <select value={season} onChange={e => setSeason(Number(e.target.value))} style={{
              width: "100%",
              marginTop: "8px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              color: "#fff",
              padding: "10px 12px",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "15px",
              cursor: "pointer",
            }}>
              {seasons.map(s => (
                <option key={s} value={s} style={{ background: "#0a0a0f" }}>{s}</option>
              ))}
            </select>
          </div>

          {/* circuit list */}
          <div style={{ flex: 1 }}>
            <Label>Circuit</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px" }}>
              {races.map(circuit => (
                <button key={circuit} onClick={() => setSelectedCircuit(circuit)} style={{
                  padding: "10px 12px",
                  background: selectedCircuit === circuit ? "rgba(232,0,45,0.15)" : "transparent",
                  border: "1px solid",
                  borderColor: selectedCircuit === circuit ? "#E8002D" : "rgba(255,255,255,0.06)",
                  borderRadius: "8px",
                  color: selectedCircuit === circuit ? "#fff" : "rgba(255,255,255,0.4)",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "13px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}>
                  {circuit.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {mode === "2026" && (
        <div style={{ flex: 1 }}>
          <Label>Qualifying Order</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
            {grid.map((val, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.25)",
                  width: "24px",
                  textAlign: "right",
                }}>
                  P{i + 1}
                </span>
                <select
                  value={val}
                  onChange={e => {
                    const updated = [...grid]
                    updated[i] = e.target.value
                    setGrid(updated)
                  }}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "6px",
                    color: val ? "#fff" : "rgba(255,255,255,0.25)",
                    padding: "6px 8px",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  <option value="" style={{ background: "#0a0a0f" }}>— Driver —</option>
                  {DRIVERS_2026.map(d => (
                    <option key={d} value={d} style={{ background: "#0a0a0f" }}>
                      {d.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

     {/* predict button — always visible at bottom */}
        <button onClick={handleSubmit} style={{
          marginTop: "16px",
          flexShrink: 0,
          padding: "14px",
          background: "#E8002D",
          border: "none",
          borderRadius: "10px",
          color: "#fff",
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "14px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}>
          Predict
        </button>

      </div>
    </>
  )
}


// helper to avoid repeating label styles
function Label({ children }) {
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: "9px",
      color: "rgba(255,255,255,0.3)",
      letterSpacing: "0.25em",
      textTransform: "uppercase",
    }}>
      {children}
    </span>
  )
}
