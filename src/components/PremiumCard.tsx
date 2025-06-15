
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

const PremiumCard = ({ 
  children, 
  className = "", 
  hover = true, 
  glass = false 
}: PremiumCardProps) => {
  return (
    <div 
      className={cn(
        "rounded-2xl border transition-all duration-300",
        glass 
          ? "glass shadow-premium" 
          : "bg-gradient-to-br from-white to-delyft-gray-50/30 border-delyft-gray-200/50 shadow-premium",
        hover && "hover-lift cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PremiumCard;
