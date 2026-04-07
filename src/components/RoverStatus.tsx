import { motion } from "framer-motion";
import { useRoverData } from "@/hooks/useRoverData";
import { AlertCircle } from "lucide-react";

const RoverStatus = () => {
  const { data, loading, error } = useRoverData();

  // Set default values for rendering
  let mode: 'idle' | 'navigating' | 'watering' | 'obstacle' = 'idle';
  let batteryLevel = 0;
  let waterLevel = 0;
  let latitude = 0;
  let longitude = 0;

  // Map Firebase state to component mode
  const stateMap = {
    'charging': 'idle',
    'navigating': 'navigating',
    'off': 'idle'
  } as const;

  if (!loading && data) {
    batteryLevel = data.battery_level;
    waterLevel = data.water_tank_level;
    latitude = data.latitude;
    longitude = data.longitude;
    mode = stateMap[data.state] || 'idle';
  }

  const modeConfig = {
    idle: { emoji: "😴", label: "Idle", color: "bg-muted" },
    navigating: { emoji: "🚜", label: "Navigating", color: "bg-terra-yellow/20" },
    watering: { emoji: "💧", label: "Watering", color: "bg-terra-green/20" },
    obstacle: { emoji: "👀", label: "Obstacle detected", color: "bg-terra-orange/20" },
  };

  const current = modeConfig[mode];

  const statusMessage = {
    idle: "Taking a little rest... 💤",
    navigating: "Rolling over to water a thirsty plant 🌱",
    watering: "Giving this plant a nice drink 💧",
    obstacle: "Hmm, something's in the way! 🤔",
  };

  return (
    <div className="terra-card flex flex-col gap-4 h-full">
      <h2 className="text-lg font-extrabold text-foreground">Meet Your Rover 🤖</h2>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" opacity="0.2" />
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" strokeDasharray="113" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Cute Rover SVG */}
          <div className="flex justify-center py-3">
            <motion.div
              className="relative"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="120" height="110" viewBox="0 0 120 110" fill="none">
                {/* Body */}
                <rect x="20" y="30" width="80" height="50" rx="16" fill="hsl(20, 50%, 45%)" />
                <rect x="25" y="35" width="70" height="40" rx="12" fill="hsl(20, 45%, 52%)" />
                
                {/* Eyes container */}
                <rect x="30" y="10" width="60" height="35" rx="12" fill="hsl(220, 12%, 22%)" />
                <rect x="33" y="13" width="54" height="29" rx="10" fill="hsl(220, 15%, 30%)" />
                
                {/* Left eye */}
                <motion.g
                  animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1, 1] }}
                  style={{ transformOrigin: "47px 27px" }}
                >
                  <circle cx="47" cy="27" r="9" fill="hsl(200, 80%, 85%)" />
                  <circle cx="49" cy="25" r="5" fill="hsl(220, 15%, 13%)" />
                  <circle cx="50" cy="24" r="2" fill="white" />
                </motion.g>
                
                {/* Right eye */}
                <motion.g
                  animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1, 1] }}
                  style={{ transformOrigin: "73px 27px" }}
                >
                  <circle cx="73" cy="27" r="9" fill="hsl(200, 80%, 85%)" />
                  <circle cx="75" cy="25" r="5" fill="hsl(220, 15%, 13%)" />
                  <circle cx="76" cy="24" r="2" fill="white" />
                </motion.g>

                {/* Antenna */}
                <line x1="60" y1="10" x2="60" y2="2" stroke="hsl(0,0%,50%)" strokeWidth="2" />
                <motion.circle
                  cx="60" cy="2" r="3"
                  fill="hsl(var(--terra-yellow))"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Wheels */}
                <circle cx="35" cy="85" r="10" fill="hsl(220, 10%, 25%)" />
                <circle cx="35" cy="85" r="6" fill="hsl(220, 10%, 35%)" />
                <circle cx="85" cy="85" r="10" fill="hsl(220, 10%, 25%)" />
                <circle cx="85" cy="85" r="6" fill="hsl(220, 10%, 35%)" />

                {/* Arms */}
                <rect x="5" y="45" width="15" height="6" rx="3" fill="hsl(20, 40%, 40%)" />
                <rect x="100" y="45" width="15" height="6" rx="3" fill="hsl(20, 40%, 40%)" />
              </svg>
            </motion.div>
          </div>

          {/* Status rows */}
          <div className="flex flex-col gap-2">
            <StatusPill label="Battery" value={`${batteryLevel}%`} dotColor={batteryLevel > 30 ? "bg-terra-green" : "bg-destructive"} />
            <StatusPill label="Water tank" value={`${waterLevel}%`} dotColor={waterLevel > 25 ? "bg-terra-green" : "bg-primary"} />
            <StatusPill label="Location" value={`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`} dotColor="bg-blue-500" />
            <div className={`flex items-center gap-2 rounded-2xl px-3 py-2 ${current.color}`}>
              <span className="text-lg">{current.emoji}</span>
              <span className="text-sm font-bold text-foreground">{current.label}</span>
            </div>
          </div>

          {/* Friendly message */}
          <div className="mt-auto rounded-2xl bg-muted/50 px-4 py-3">
            <p className="text-sm text-muted-foreground font-medium italic">
              {statusMessage[mode]}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

const StatusPill = ({ label, value, dotColor }: { label: string; value: string; dotColor: string }) => (
  <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-3 py-2">
    <div className="flex items-center gap-2">
      <motion.div
        className={`w-2.5 h-2.5 rounded-full ${dotColor}`}
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </div>
    <span className="text-sm font-bold text-foreground">{value}</span>
  </div>
);

export default RoverStatus;
