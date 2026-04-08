export interface GreenhouseMeasurement {
  timestamp: string;
  plant_name: string;
  humidity: number;
  temperature: number;
  optimal_humidity: number;
  soil_moisture: number;
  optimal_soil_moisture: number;
  last_watered: string;
  status: "normal" | "warning";
}

export interface RoverStatus {
  timestamp: string;
  latitude: number;
  longitude: number;
  battery_level: number;
  water_tank_level: number;
  state: "charging" | "navigating" | "off";
}

export interface LiveDataResponse {
  plants: GreenhouseMeasurement[];
  roverStatus: RoverStatus | null;
  fetchedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

export async function fetchLiveData(): Promise<LiveDataResponse> {
  const response = await fetch(`${API_BASE_URL}/api/live-data`);
  if (!response.ok) {
    throw new Error(`Failed to fetch live data (${response.status})`);
  }
  return response.json();
}

export interface AIDecisionResponse {
  decision: "water" | "no_action" | "alert_gardener";
  water_ml: number;
  urgency: "low" | "medium" | "high" | "critical";
  plant_status: "healthy" | "stressed" | "diseased" | "critical";
  diagnosis: string;
  recommendations: string[];
  next_check_minutes: number;
}

export async function requestAIDecision(plant: GreenhouseMeasurement): Promise<AIDecisionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/autonomous-decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      plant_name: plant.plant_name,
      sensor_data: {
        soil_moisture:         plant.soil_moisture,
        optimal_soil_moisture: plant.optimal_soil_moisture,
        temperature:           plant.temperature,
        humidity:              plant.humidity,
        optimal_humidity:      plant.optimal_humidity,
      },
      ml_prediction: { label: "healthy", confidence: 0.85 },
    }),
  });
  if (!response.ok) {
    throw new Error(`AI decision failed (${response.status})`);
  }
  return response.json();
}
