
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
      case 'up': return 'text-emerald-600 dark:text-emerald-400';
      case 'down': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getIconBg = () => {
    switch (trend) {
      case 'up': return 'bg-emerald-100 dark:bg-emerald-500/10';
      case 'down': return 'bg-red-100 dark:bg-red-500/10';
      default: return 'bg-blue-100 dark:bg-primary/10';
    }
  };

  const getIconColor = () => {
    switch (trend) {
      case 'up': return 'text-emerald-700 dark:text-emerald-400';
      case 'down': return 'text-red-700 dark:text-red-400';
      default: return 'text-blue-700 dark:text-primary';
    }
  };

  return (
    <Card className={`group relative overflow-hidden border-gray-200 dark:border-border/50 bg-white/90 dark:bg-card/50 backdrop-blur-sm hover:bg-white dark:hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-600 dark:text-muted-foreground tracking-wide uppercase">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-foreground tracking-tight">{value}</p>
            {change && (
              <p className={`text-sm font-medium ${getTrendColor()}`}>
                {change}
              </p>
            )}
          </div>
          <div className={`p-4 rounded-2xl ${getIconBg()} transition-colors duration-300`}>
            <Icon className={`h-6 w-6 ${getIconColor()}`} />
          </div>
        </div>
      </div>
    </Card>
  );
};
