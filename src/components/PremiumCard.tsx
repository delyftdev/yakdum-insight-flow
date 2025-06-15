
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const PremiumCard = ({ 
  children, 
  className = "", 
  hover = true 
}: PremiumCardProps) => {
  return (
    <div 
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-clean transition-all duration-200",
        hover && "hover:shadow-clean-lg hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PremiumCard;
