import GlassPanel from "./GlassPanel"
import AnimatedBar from "./AnimatedBar"
import { MOCK_PREDICTIONS, TEAM_COLORS, teamKey } from "../src/mockData"

export default function PredictionsSection({ predictions: predictionsProp }) {
  const { predictions } = predictionsProp || MOCK_PREDICTIONS
  const maxValue = Math.max(...predictions.map(d => d.win_probability))
  const formatName = (str) => str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())

  return (
    <GlassPanel>
      <div style={{ borderLeft: "3px solid #E8002D", paddingLeft: "12px", marginBottom: "28px" }}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            Win Probability — XGBoost Model
        </span>
      </div>
      <div>
        {predictions.map((driver, index) => (
          <AnimatedBar
            key={driver.driver}
            value={driver.win_probability}
            maxValue={maxValue}
            color={TEAM_COLORS[teamKey(driver.team)] || "#fff"}
            delay={index * 0.06}
            label={formatName(driver.driver)}
            sublabel={`P${driver.grid} · ${formatName(driver.team)}`}
            rightLabel={(driver.win_probability * 100).toFixed(1) + "%"}
          />
        ))}
      </div>
    </GlassPanel>
  )
}