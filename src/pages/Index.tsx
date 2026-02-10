import Header from "@/components/Header";
import RoverStatus from "@/components/RoverStatus";
import PlantHealthMonitor from "@/components/PlantHealthMonitor";
import RoverVision from "@/components/RoverVision";
import ControlPanel from "@/components/ControlPanel";
import EcoLove from "@/components/EcoLove";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6 flex flex-col gap-5 max-w-[1440px] mx-auto">
      {/* Header */}
      <Header />

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-[280px_1fr_260px] gap-5 flex-1">
        {/* Left: Rover Status */}
        <RoverStatus />

        {/* Center: Plant Health Monitor */}
        <PlantHealthMonitor />

        {/* Right: Rover Vision */}
        <RoverVision />
      </div>

      {/* Bottom: Control Panel */}
      <ControlPanel />

      {/* Eco Collapsible */}
      <EcoLove />
    </div>
  );
};

export default Index;
