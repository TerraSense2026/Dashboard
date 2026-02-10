import { useState } from "react";
import { motion } from "framer-motion";

const ControlPanel = () => {
  const [pressed, setPressed] = useState<string | null>(null);

  const handlePress = (id: string) => {
    setPressed(id);
    setTimeout(() => setPressed(null), 300);
  };

  const buttons = [
    { id: "goto", label: "Go to selected plant", emoji: "🌱", variant: "default" as const },
    { id: "water", label: "Water now", emoji: "💧", variant: "default" as const },
    { id: "home", label: "Return to base", emoji: "🏠", variant: "default" as const },
    { id: "stop", label: "Emergency stop", emoji: "🛑", variant: "danger" as const },
  ];

  return (
    <div className="terra-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold text-foreground">Tell Me What To Do 🎮</h2>
        <p className="text-sm text-muted-foreground font-medium">You can always step in if needed.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {buttons.map((btn) => (
          <motion.button
            key={btn.id}
            onClick={() => handlePress(btn.id)}
            animate={pressed === btn.id ? { scale: [1, 0.93, 1] } : {}}
            transition={{ duration: 0.2 }}
            className={`
              flex-1 min-w-[160px] rounded-2xl px-5 py-4 font-bold text-sm
              transition-all duration-200 cursor-pointer
              ${btn.variant === "danger"
                ? "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25 hover:shadow-[0_0_20px_hsl(0,65%,55%,0.2)]"
                : "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 hover:shadow-glow-yellow"
              }
            `}
          >
            <span className="text-xl mr-2">{btn.emoji}</span>
            {btn.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;
