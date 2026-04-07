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
