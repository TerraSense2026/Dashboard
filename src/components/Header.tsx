import { Battery, Cloud, Wifi, WifiOff } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  const isConnected = true;
  const batteryLevel = 78;

  return (
    <header className="rounded-3xl bg-card shadow-pillow border border-border/50 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-primary">
          WALL-EDEN Control Center
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          TerraSense — Caring for plants, one leaf at a time 🌿
        </p>
      </div>

      <div className="flex items-center gap-5">
        {/* Battery */}
        <div className="flex items-center gap-2 bg-muted rounded-2xl px-4 py-2">
          <Battery className="w-5 h-5 text-terra-green" />
          <span className="text-sm font-bold text-foreground">{batteryLevel}%</span>
        </div>

        {/* Connection */}
        <div className="flex items-center gap-2 bg-muted rounded-2xl px-4 py-2">
          {isConnected ? (
            <>
              <Wifi className="w-5 h-5 text-terra-green" />
              <span className="text-sm font-bold text-foreground">Connected</span>
              <motion.div
                className="w-2 h-2 rounded-full bg-terra-green"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-destructive" />
              <span className="text-sm font-bold text-foreground">Offline</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
