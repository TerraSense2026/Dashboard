import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const EcoLove = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="terra-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-foreground">Eco-Mode Active</span>
          <span className="text-sm">🌍💚</span>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4 flex gap-4">
              <EcoStat label="Water used today" value="340 ml" emoji="💧" />
              <EcoStat label="Water saved vs manual" value="180 ml" emoji="🌿" />
              <EcoStat label="Efficiency" value="94%" emoji="⚡" />
            </div>

            {/* Mini chart placeholder */}
            <div className="mt-4 rounded-2xl bg-muted/30 p-4 h-20 flex items-end gap-1">
              {[40, 55, 35, 70, 60, 45, 50, 65, 55, 48, 42, 58].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-lg bg-terra-green/50"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center font-medium">Water usage over 12 hours</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EcoStat = ({ label, value, emoji }: { label: string; value: string; emoji: string }) => (
  <div className="flex-1 rounded-2xl bg-muted/50 px-4 py-3 text-center">
    <p className="text-lg mb-1">{emoji}</p>
    <p className="text-base font-extrabold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground font-medium">{label}</p>
  </div>
);

export default EcoLove;
