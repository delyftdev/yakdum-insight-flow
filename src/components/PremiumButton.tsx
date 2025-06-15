
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
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 shadow-clean",
    secondary: "bg-gray-100 text-black hover:bg-gray-200",
    outline: "border border-gray-200 text-black hover:bg-gray-50",
    ghost: "text-gray-600 hover:text-black hover:bg-gray-100"
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
