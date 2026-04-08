import { useState } from "react";
import { motion } from "framer-motion";
import { GreenhouseMeasurement, requestAIDecision } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ControlPanelProps {
  selectedPlant: GreenhouseMeasurement | null;
}

const ControlPanel = ({ selectedPlant }: ControlPanelProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePress = async (id: string) => {
    if (id === "water" || id === "goto") {
      if (!selectedPlant) {
        toast({
          title: "No plant selected",
          description: "Select a plant from the greenhouse panel first",
          variant: "destructive",
        });
        return;
      }

      setLoading(id);
      try {
        const decision = await requestAIDecision(selectedPlant);

        const actionEmoji = { water: "💧", no_action: "✅", alert_gardener: "🚨" }[decision.decision] ?? "🤖";

        toast({
          title: `${actionEmoji} ${decision.decision.replace("_", " ").toUpperCase()} — ${selectedPlant.plant_name}`,
          description: decision.diagnosis,
        });
      } catch (err) {
        toast({
          title: "❌ Command failed",
          description: err instanceof Error ? err.message : "Could not reach the server",
          variant: "destructive",
        });
      } finally {
        setLoading(null);
      }
      return;
    }

    // Return to base & Emergency stop — direct commands, no AI needed
    toast({
      title: id === "stop" ? "🛑 Emergency stop" : "🏠 Returning to base",
      description: id === "stop" ? "Stop command sent to rover" : "Rover heading home",
      variant: id === "stop" ? "destructive" : "default",
    });
  };

  const buttons = [
    { id: "goto",  label: "Go to selected plant", emoji: "🌱", variant: "default" as const },
    { id: "water", label: "Water now",             emoji: "💧", variant: "default" as const },
    { id: "home",  label: "Return to base",        emoji: "🏠", variant: "default" as const },
    { id: "stop",  label: "Emergency stop",        emoji: "🛑", variant: "danger"  as const },
  ];

  return (
    <div className="terra-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold text-foreground">Tell Me What To Do 🎮</h2>
        <p className="text-sm text-muted-foreground font-medium">
          {selectedPlant
            ? `Selected: ${selectedPlant.plant_name}`
            : "You can always step in if needed."}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {buttons.map((btn) => (
          <motion.button
            key={btn.id}
            onClick={() => handlePress(btn.id)}
            disabled={loading !== null}
            animate={loading === btn.id ? { scale: [1, 0.93, 1] } : {}}
            transition={{ duration: 0.2 }}
            className={`
              flex-1 min-w-[160px] rounded-2xl px-5 py-4 font-bold text-sm
              transition-all duration-200
              ${loading !== null ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${btn.variant === "danger"
                ? "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25 hover:shadow-[0_0_20px_hsl(0,65%,55%,0.2)]"
                : "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 hover:shadow-glow-yellow"
              }
            `}
          >
            <span className="text-xl mr-2">
              {loading === btn.id ? "⏳" : btn.emoji}
            </span>
            {loading === btn.id ? "Asking AI..." : btn.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;
