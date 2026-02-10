import { motion } from "framer-motion";

const RoverVision = () => {
  return (
    <div className="terra-card flex flex-col gap-4 h-full">
      <h2 className="text-lg font-extrabold text-foreground">What I See 👀</h2>

      {/* Camera preview */}
      <div className="relative rounded-3xl overflow-hidden bg-muted aspect-[16/10] border-2 border-border">
        {/* Simulated camera view */}
        <div className="absolute inset-0 bg-gradient-to-b from-terra-green-soft/80 to-background/90 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className="text-4xl mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🌱
            </motion.div>
            <p className="text-xs font-bold text-foreground/70">Live Feed</p>
          </div>
        </div>

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-terra-green/40"
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 rounded-3xl" style={{
          boxShadow: "inset 0 0 40px 15px hsl(220, 15%, 13%)"
        }} />

        {/* Binocular overlay */}
        <div className="absolute inset-0 rounded-3xl border-4 border-muted/30" />
      </div>

      {/* Status text */}
      <div className="rounded-2xl bg-muted/50 px-4 py-3">
        <p className="text-sm font-bold text-foreground">
          📍 Heading to Plant B
        </p>
        <p className="text-xs text-muted-foreground font-medium mt-1">
          Carefully avoiding obstacles...
        </p>
      </div>

      {/* Mini stats */}
      <div className="flex gap-2 mt-auto">
        <div className="flex-1 rounded-2xl bg-muted/30 px-3 py-2 text-center">
          <p className="text-xs text-muted-foreground">Distance</p>
          <p className="text-sm font-bold text-foreground">1.2m</p>
        </div>
        <div className="flex-1 rounded-2xl bg-muted/30 px-3 py-2 text-center">
          <p className="text-xs text-muted-foreground">Objects</p>
          <p className="text-sm font-bold text-foreground">0</p>
        </div>
      </div>
    </div>
  );
};

export default RoverVision;
