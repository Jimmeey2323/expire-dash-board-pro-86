
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

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
      default: return 'text-slate-500 dark:text-slate-400';
    }
  };

  const getIconBg = () => {
    switch (trend) {
      case 'up': return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400';
      case 'down': return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <Card className={`business-card-elevated p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-caption uppercase tracking-wider mb-2">
            {title}
          </p>
          
          <div className="space-y-2">
            <p className="text-3xl font-bold text-heading">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            
            {change && (
              <div className="flex items-center gap-1.5">
                {trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-600" />}
                {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {change}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className={`p-3 rounded-xl ${getIconBg()}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};
