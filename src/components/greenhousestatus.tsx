import React, { useState } from 'react';
import { useGreenhouseData, GreenhouseMeasurement } from '@/hooks/useGreenhouseData';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface PlantCardProps {
  measurement: GreenhouseMeasurement;
}

const getMoodConfig = (status: string, humidityDiff: number, soilDiff: number) => {
  const moodConfigs = {
    happy: { emoji: "😊", label: "Happy", color: "bg-green-100 text-green-700" },
    okay: { emoji: "😐", label: "Okay", color: "bg-blue-100 text-blue-700" },
    stressed: { emoji: "😟", label: "Stressed", color: "bg-orange-100 text-orange-700" },
  };

  if (status === "warning" || humidityDiff >= 15 || soilDiff >= 15) {
    return moodConfigs.stressed;
  } else if (humidityDiff >= 8 || soilDiff >= 8) {
    return moodConfigs.okay;
  }
  return moodConfigs.happy;
};

const generateInsights = (measurement: GreenhouseMeasurement): string[] => {
  const insights: string[] = [];
  const humidityDiff = Math.abs(measurement.humidity - measurement.optimal_humidity);
  const soilDiff = Math.abs(measurement.soil_moisture - measurement.optimal_soil_moisture);

  if (measurement.humidity > measurement.optimal_humidity + 5) {
    insights.push("Humidity is a bit high, improve air circulation");
  } else if (measurement.humidity < measurement.optimal_humidity - 5) {
    insights.push("Air is too dry, consider misting or increasing humidity");
  } else {
    insights.push("Humidity levels are perfect");
  }

  if (measurement.soil_moisture > measurement.optimal_soil_moisture + 5) {
    insights.push("Soil is too wet, reduce watering frequency");
  } else if (measurement.soil_moisture < measurement.optimal_soil_moisture - 5) {
    insights.push("Soil is dry, water soon to prevent stress");
  } else {
    insights.push("Soil moisture is right on track");
  }

  if (measurement.temperature < 18 || measurement.temperature > 28) {
    insights.push("Temperature is outside ideal range");
  } else {
    insights.push("Temperature is suitable for growth");
  }

  return insights;
};

const PlantCard: React.FC<PlantCardProps> = ({ measurement }) => {
  const humidityDiff = Math.abs(measurement.humidity - measurement.optimal_humidity);
  const soilDiff = Math.abs(measurement.soil_moisture - measurement.optimal_soil_moisture);
  const mood = getMoodConfig(measurement.status, humidityDiff, soilDiff);
  const insights = generateInsights(measurement);

  return (
    <div className="flex flex-col gap-4">
      {/* Stats bubbles */}
      <div className="grid grid-cols-2 gap-3">
        <StatBubble 
          label="Soil Moisture" 
          value={`${measurement.soil_moisture}%`} 
          icon="💧"
          optimal={measurement.optimal_soil_moisture}
        />
        <StatBubble 
          label="Temperature" 
          value={`${measurement.temperature}°C`} 
          icon="🌡️"
        />
        <StatBubble 
          label="Humidity" 
          value={`${measurement.humidity}%`} 
          icon="💨"
          optimal={measurement.optimal_humidity}
        />
        <StatBubble 
          label="Last Watered" 
          value={format(new Date(measurement.last_watered), 'p')} 
          icon="⏰"
        />
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
      <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4">
        <h3 className="text-sm font-extrabold text-primary mb-2">TerraSense Insight ✨</h3>
        <ul className="space-y-1">
          {insights.map((insight, i) => (
            <li key={i} className="text-sm text-muted-foreground font-medium">
              • {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const StatBubble = ({ label, value, icon, optimal }: { label: string; value: string; icon: string; optimal?: number }) => (
  <div className="rounded-2xl bg-muted/50 px-4 py-3 flex flex-col gap-1">
    <span className="text-xs text-muted-foreground font-medium">{icon} {label}</span>
    <span className="text-lg font-extrabold text-foreground">{value}</span>
    {optimal !== undefined && <span className="text-xs text-muted-foreground">optimal: {optimal}%</span>}
  </div>
);

export const GreenhouseStatus: React.FC = () => {
  const { data, loading, error } = useGreenhouseData();
  const [selectedPlant, setSelectedPlant] = useState<string>('');

  if (loading) {
    return (
      <div className="terra-card flex flex-col gap-5 h-full">
        <h2 className="text-lg font-extrabold text-foreground">Greenhouse Status 🌱</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-full" />
          <div className="h-64 bg-gray-200 rounded w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="terra-card flex flex-col gap-5 h-full">
        <h2 className="text-lg font-extrabold text-foreground">Greenhouse Status 🌱</h2>
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <p className="font-semibold text-red-900">Error loading data</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const plants = Object.values(data);

  if (plants.length === 0) {
    return (
      <div className="terra-card flex flex-col gap-5 h-full">
        <h2 className="text-lg font-extrabold text-foreground">Greenhouse Status 🌱</h2>
        <p className="text-muted-foreground text-center">No greenhouse data available</p>
      </div>
    );
  }

  // Set default plant on first load
  const currentPlant = selectedPlant 
    ? plants.find(p => p.plant_name === selectedPlant) || plants[0]
    : plants[0];

  if (!selectedPlant && plants.length > 0) {
    setSelectedPlant(plants[0].plant_name);
  }

  return (
    <div className="terra-card flex flex-col gap-5 h-full">
      <h2 className="text-lg font-extrabold text-foreground">Greenhouse Status 🌱</h2>

      {/* Tabs */}
      <div className="flex gap-2 bg-muted/50 rounded-2xl p-1 overflow-x-auto">
        {plants.map((p) => (
          <button
            key={p.plant_name}
            onClick={() => setSelectedPlant(p.plant_name)}
            className={`relative flex-shrink-0 rounded-xl px-3 py-2 text-sm font-bold transition-all duration-300 whitespace-nowrap ${
              currentPlant.plant_name === p.plant_name 
                ? "bg-card shadow-lg text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.plant_name}
            {p.status === 'warning' && <AlertCircle className="inline-block w-3 h-3 ml-1" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPlant.plant_name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="flex-1"
        >
          <PlantCard measurement={currentPlant} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};