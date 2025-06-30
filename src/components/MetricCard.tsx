
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const MetricCard = ({ title, value, change, icon: Icon, trend = 'neutral', className = '' }: MetricCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-emerald-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className={`p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <p className={`text-sm ${getTrendColor()}`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-500/20 rounded-lg">
          <Icon className="h-6 w-6 text-blue-400" />
        </div>
      </div>
    </Card>
  );
};
