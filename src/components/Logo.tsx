
import { Zap } from "lucide-react";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-clean">
          <Zap className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-black">
          Yakdum
        </span>
        <span className="text-xs text-gray-600 font-medium tracking-wider">
          AI INSIGHTS
        </span>
      </div>
    </div>
  );
};

export default Logo;
