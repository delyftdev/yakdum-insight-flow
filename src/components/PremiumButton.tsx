
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PremiumButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const PremiumButton = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "",
  onClick,
  disabled = false
}: PremiumButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-delyft-primary to-delyft-secondary text-white shadow-indigo hover:shadow-indigo/40 hover:scale-105",
    secondary: "bg-delyft-gray-100 text-delyft-gray-900 hover:bg-delyft-gray-200",
    outline: "border-2 border-delyft-primary text-delyft-primary hover:bg-delyft-primary hover:text-white",
    ghost: "text-delyft-gray-600 hover:text-delyft-primary hover:bg-delyft-primary/5"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PremiumButton;
