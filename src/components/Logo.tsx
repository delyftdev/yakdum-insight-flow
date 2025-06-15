
import { Zap } from "lucide-react";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-delyft-primary to-delyft-secondary rounded-xl flex items-center justify-center shadow-lg">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-delyft-primary to-delyft-secondary rounded-xl opacity-20 blur-lg"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold font-display text-delyft-gray-900">
          delyft.ai
        </span>
        <span className="text-xs text-delyft-gray-600 font-medium tracking-wider">
          AI INSIGHTS
        </span>
      </div>
    </div>
  );
};

export default Logo;
