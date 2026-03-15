import GlassPanel from "./GlassPanel"
import { TEAM_COLORS, teamKey } from "../src/mockData"
import { useState, useEffect, useRef } from "react"

// Individual feature card showing a specific model input
function FeatureCard({ driver, team, feature, value, percentage, color, delay, rank }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const formatName = (str) => str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  const barWidth = visible ? `${Math.max(percentage, 4)}%` : "0%"
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
  <div ref={ref}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    style={{
      background:  "rgba(10,10,15,0.85)",
      border: `1px solid ${hovered ? color + "66" : color + "22"}`,
      borderRadius: "10px",
      padding: "16px",
      position: "relative",
      minWidth: "220px",
      transform: hovered ? "scale(1.02) translateY(-5px)" : "scale(1)",
      transition: "transform 0.08s ease-out, border-color 0.08s ease-out, box-shadow 0.08s ease-out",
      boxShadow: `0 0 20px ${color}22`,
      cursor: "default",
    }}>
      {/* Rank badge */}
      {rank <= 3 && (
        <div style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : "#CD7F32",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: 700,
          color: "#000",
        }}>
          {rank}
        </div>
      )}

      <div style={{ marginBottom: "12px" }}>
        <div style={{ color, fontWeight: 700, fontSize: "13px", marginBottom: "4px", paddingRight: rank <= 3 ? "28px" : "0" }}>
          {formatName(driver)}
        </div>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>
          {formatName(team)}
        </div>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <div style={{ 
          color: "#fff", 
          fontSize: "24px", 
          fontWeight: 700,
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>
          {typeof value === 'number' ? value.toFixed(2) : value}
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", textTransform: "uppercase" }}>
          {feature}
        </div>
      </div>

      <div style={{ 
        height: "4px", 
        background: "rgba(255,255,255,0.06)", 
        borderRadius: "2px",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: barWidth,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          borderRadius: "2px",
          transition: `width 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
          boxShadow: `0 0 6px ${color}66`,
        }} />
      </div>
    </div>
  )
}

// Main section showing top drivers and their key model features
export default function ModelFeaturesSection({ predictions }) {
  const data = predictions?.predictions || []
  const topDrivers = data.slice(0, 6) // Show top 6 drivers

  // Feature display configurations with importance weights
  const is2026 = predictions?.season === 2026
  const features = [
    { key: "grid", label: "Grid Position", inverse: true, importance: 34 },
    { key: "driver_avg_finish_last3", label: "Avg Finish (Last 3)", inverse: true, importance: 21 },
    { key: "driver_circuit_win_rate", label: "Circuit Win Rate (%)", inverse: false, importance: 15, asPercent: true },
    ...(!is2026 ? [{ key: "team_avg_points_last3", label: "Team Pts (Last 3)", inverse: false, importance: 12 }] : []),
  ]


  if (!predictions || topDrivers.length === 0) {
    return null
  }

  return (
    <div>
      <div style={{ borderLeft: "3px solid #27F4D2", paddingLeft: "12px", marginBottom: "12px" }}>
        <span style={{ 
          fontFamily: "'Barlow Condensed', sans-serif", 
          fontSize: "11px", 
          letterSpacing: "0.25em", 
          textTransform: "uppercase", 
          color: "rgba(255,255,255,0.4)" 
        }}>
          Model Features — What Drives The Predictions
        </span>
      </div>
      
      {/* Importance note */}
      <div style={{ 
        marginBottom: "28px", 
        paddingLeft: "15px",
        color: "rgba(255,255,255,0.35)", 
        fontSize: "11px",
        fontStyle: "italic",
      }}>
        Showing top 4 features by importance (82% of model weight)
      </div>

      {features.map((feature, featureIdx) => {
        // Get all values for this feature
        const values = topDrivers.map(d => {
          let val = d[feature.key] ?? 0
          if (feature.asPercent) val = val * 100 // Convert to percentage
          return val
        })
        
        // For better visualization, calculate percentages based on best/worst
        const minVal = Math.min(...values)
        const maxVal = Math.max(...values)
        const range = maxVal - minVal || 1 // Avoid division by zero

        // Sort drivers by this feature to assign ranks
        const sorted = topDrivers
          .map((d, idx) => ({ driver: d, value: values[idx], origIdx: idx }))
          .sort((a, b) => feature.inverse ? a.value - b.value : b.value - a.value)

        return (
          <div key={feature.key} style={{ 
              marginBottom: "32px",
              background: "rgba(10,10,15,0.6)",
              backdropFilter: "blur(22px)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 8px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}>
              <div style={{ 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}>
              <div style={{ 
                color: "rgba(255,255,255,0.5)", 
                fontSize: "12px",
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {feature.label}
              </div>
              <div style={{
                color: "rgba(255,255,255,0.25)",
                fontSize: "10px",
                fontFamily: "'DM Mono', monospace",
              }}>
                {feature.importance}% importance
              </div>
            </div>

            <div style = {{ paddingTop: "20px", marginTop: "-20px", paddingBottom: "20px", marginBottom: "-20px" }}>
            <div className="feature-row" style={{ 
                display: "flex",
                gap: "12px",
                overflowX: "auto",
                paddingTop: "16px",
                paddingBottom: "16px",
                paddingLeft: "4px",
                paddingRight: "4px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
            }}>
              {topDrivers.map((driver, idx) => {
                const color = TEAM_COLORS[teamKey(driver.team)] || "#fff"
                let value = driver[feature.key] ?? 0
                if (feature.asPercent) value = value * 100
                
                // Calculate bar percentage (0-100)
                let percentage
                if (feature.inverse) {
                  // For inverse (lower is better), invert the scale
                  percentage = ((maxVal - value) / range) * 100
                } else {
                  // For normal (higher is better)
                  percentage = ((value - minVal) / range) * 100
                }
                
                // Find rank for this driver
                const rank = sorted.findIndex(s => s.origIdx === idx) + 1

                return (
                  <FeatureCard
                    key={driver.driver}
                    driver={driver.driver}
                    team={driver.team}
                    feature={feature.label}
                    value={value}
                    percentage={percentage}
                    color={color}
                    delay={featureIdx * 0.1 + idx * 0.05}
                    rank={rank}
                  />
                )
              })}
            </div>
          </div>
         </div>
        )
      })}

      <div style={{ 
        marginTop: "24px",
        padding: "16px",
        background: "rgba(39, 244, 210, 0.05)",
        border: "1px solid rgba(39, 244, 210, 0.2)",
        borderRadius: "8px",
      }}>
        <div style={{ 
          color: "#27F4D2", 
          fontSize: "11px",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}>
          How It Works
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: 1.6 }}>
          The XGBoost model analyzes 9 features total. These 4 features account for 82% of the model's 
          decision-making. Bar length shows relative performance. Longer bars indicate better values for 
          that specific feature. Gold/silver/bronze badges mark top 3 performers per feature.
        </div>
      </div>
    </div>
  )
}