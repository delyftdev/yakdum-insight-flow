
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import PremiumCard from "./PremiumCard";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: string;
}

const FeatureCard = ({ icon: Icon, title, description, gradient = "from-black to-gray-800" }: FeatureCardProps) => {
  return (
    <PremiumCard className="p-8 text-center group">
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold font-display text-gray-900 mb-4">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </PremiumCard>
  );
};

export default FeatureCard;
