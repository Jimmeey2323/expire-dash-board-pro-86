
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
      case 'down': return 'text-red-500 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getGradientBg = () => {
    switch (trend) {
      case 'up': return 'from-emerald-500/10 to-teal-500/10';
      case 'down': return 'from-red-500/10 to-rose-500/10';
      default: return 'from-blue-500/10 to-purple-500/10';
    }
  };

  const getIconGradient = () => {
    switch (trend) {
      case 'up': return 'from-emerald-600 to-teal-600';
      case 'down': return 'from-red-600 to-rose-600';
      default: return 'from-blue-600 to-purple-600';
    }
  };

  const getBorderGlow = () => {
    switch (trend) {
      case 'up': return 'hover:shadow-emerald-500/20 border-emerald-200/50 dark:border-emerald-800/50';
      case 'down': return 'hover:shadow-red-500/20 border-red-200/50 dark:border-red-800/50';
      default: return 'hover:shadow-blue-500/20 border-blue-200/50 dark:border-blue-800/50';
    }
  };

  return (
    <Card className={`group relative overflow-hidden border-2 ${getBorderGlow()} bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${className}`}>
      {/* Premium gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradientBg()} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Animated border glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
      
      <div className="relative p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
                {title}
              </p>
              <div className="w-8 h-px bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600" />
            </div>
            
            <div className="space-y-2">
              <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight group-hover:scale-105 transition-transform duration-300">
                {value.toLocaleString()}
              </p>
              
              {change && (
                <div className="flex items-center gap-2">
                  {trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-600" />}
                  {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                  <p className={`text-sm font-bold ${getTrendColor()}`}>
                    {change}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="relative">
            {/* Icon background with gradient */}
            <div className={`p-6 rounded-3xl bg-gradient-to-br ${getIconGradient()} shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
              <Icon className="h-8 w-8 text-white drop-shadow-sm" />
            </div>
            
            {/* Floating dots decoration */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 delay-75" />
          </div>
        </div>
      </div>
    </Card>
  );
};
