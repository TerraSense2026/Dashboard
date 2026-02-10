import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PlantData {
  name: string;
  emoji: string;
  moisture: number;
  temperature: number;
  humidity: number;
  lastWatered: string;
  mood: "happy" | "okay" | "stressed";
  insight: string;
  insightDetail: string[];
  waterNeeded: number;
}

const plants: PlantData[] = [
  {
    name: "Plant A",
    emoji: "🌱",
    moisture: 72,
    temperature: 24,
    humidity: 58,
    lastWatered: "35 min ago",
    mood: "happy",
    insight: "I think this plant needs ~50 ml of water",
    insightDetail: ["Soil moisture is looking great", "Temperature is just right today"],
    waterNeeded: 50,
  },
  {
    name: "Plant B",
    emoji: "🌿",
    moisture: 38,
    temperature: 28,
    humidity: 42,
    lastWatered: "3 hours ago",
    mood: "stressed",
    insight: "I think this plant needs ~120 ml of water",
    insightDetail: ["It's warmer than usual today", "Soil feels a bit dry", "Better water soon 💧"],
    waterNeeded: 120,
  },
  {
    name: "Plant C",
    emoji: "🍃",
    moisture: 55,
    temperature: 22,
    humidity: 65,
    lastWatered: "1 hour ago",
    mood: "okay",
    insight: "I think this plant needs ~80 ml of water",
    insightDetail: ["Humidity is good", "Could use a little more moisture in the soil"],
    waterNeeded: 80,
  },
];

const moodConfig = {
  happy: { emoji: "😊", label: "Happy", color: "bg-terra-green/20 text-terra-green" },
  okay: { emoji: "😐", label: "Okay", color: "bg-primary/20 text-primary" },
  stressed: { emoji: "😟", label: "Stressed", color: "bg-terra-orange/20 text-terra-orange" },
};

const PlantHealthMonitor = () => {
  const [activeTab, setActiveTab] = useState(0);
  const plant = plants[activeTab];
  const mood = moodConfig[plant.mood];

  return (
    <div className="terra-card flex flex-col gap-5 h-full">
      <h2 className="text-lg font-extrabold text-foreground">Plant Health Monitor 🌿</h2>

      {/* Tabs */}
      <div className="flex gap-2 bg-muted/50 rounded-2xl p-1">
        {plants.map((p, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`relative flex-1 rounded-xl px-3 py-2 text-sm font-bold transition-all duration-300 ${
              activeTab === i ? "bg-card shadow-pillow text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.emoji} {p.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-4"
        >
          {/* Stats bubbles */}
          <div className="grid grid-cols-2 gap-3">
            <StatBubble label="Soil Moisture" value={`${plant.moisture}%`} icon="💧" />
            <StatBubble label="Temperature" value={`${plant.temperature}°C`} icon="🌡️" />
            <StatBubble label="Humidity" value={`${plant.humidity}%`} icon="💨" />
            <StatBubble label="Last Watered" value={plant.lastWatered} icon="⏰" />
          </div>

          {/* Mood */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-muted-foreground">Plant Mood:</span>
            <div className={`flex items-center gap-2 rounded-2xl px-4 py-2 ${mood.color} font-bold text-sm`}>
              <span className="text-xl">{mood.emoji}</span>
              {mood.label}
            </div>
          </div>

          {/* ML Insight */}
          <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4 shadow-glow-yellow">
            <h3 className="text-sm font-extrabold text-primary mb-2">TerraSense Insight ✨</h3>
            <p className="text-base font-bold text-foreground mb-2">{plant.insight}</p>
            <ul className="space-y-1">
              {plant.insightDetail.map((detail, i) => (
                <li key={i} className="text-sm text-muted-foreground font-medium">
                  • {detail}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const StatBubble = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="rounded-2xl bg-muted/50 px-4 py-3 flex flex-col gap-1">
    <span className="text-xs text-muted-foreground font-medium">{icon} {label}</span>
    <span className="text-lg font-extrabold text-foreground">{value}</span>
  </div>
);

export default PlantHealthMonitor;
