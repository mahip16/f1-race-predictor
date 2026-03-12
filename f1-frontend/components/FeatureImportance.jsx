import { MOCK_FEATURE_IMPORTANCE } from "../src/mockData"
import GlassPanel from "./GlassPanel"
import AnimatedBar from "./AnimatedBar"

const colors = ["#E8002D", "#FF8000", "#3671C6", "#27F4D2", "#FF87BC", "#229971", "#B6BABD", "#6692FF", "#64C4FF"]

function FeatureImportance() {
  const sortedFeatures = Object.entries(MOCK_FEATURE_IMPORTANCE).sort((a, b) => b[1] - a[1])
  const maxValue = sortedFeatures[0][1]

  return (
    <GlassPanel>
        <div style={{ borderLeft: "3px solid #3671C6", paddingLeft: "12px", marginBottom: "28px" }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
                Feature Importance — What The Model Weights
            </span>
        </div>
      {sortedFeatures.map(([feature, value], index) => (
        <AnimatedBar
          key={feature}
          value={value}
          maxValue={maxValue}
          color={colors[index]}
          delay={index * 0.07}
          label={feature.replace(/_/g, " ")}
          rightLabel={(value * 100).toFixed(0) + "%"}
        />
      ))}
    </GlassPanel>
  )
}

export default FeatureImportance