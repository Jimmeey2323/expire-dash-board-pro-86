
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Dumbbell,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  Filter
} from "lucide-react";

interface QuickFiltersProps {
  quickFilter: string;
  onQuickFilterChange: (filter: string) => void;
  membershipData: any[];
  availableLocations: string[];
}

export const QuickFilters = ({ 
  quickFilter, 
  onQuickFilterChange, 
  membershipData,
  availableLocations 
}: QuickFiltersProps) => {
  const activeMembers = membershipData.filter(m => m.status === 'Active');
  const expiredMembers = membershipData.filter(m => m.status === 'Expired');
  const membersWithSessions = membershipData.filter(m => m.sessionsLeft > 0);
  
  // Period filters
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const recentMembers = membershipData.filter(m => new Date(m.orderDate) >= thirtyDaysAgo);
  const weeklyMembers = membershipData.filter(m => new Date(m.orderDate) >= sevenDaysAgo);
  const expiringThisMonth = membershipData.filter(m => {
    const endDate = new Date(m.endDate);
    return endDate >= now && endDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  });

  const filterGroups = [
    {
      title: "Status Filters",
      icon: Users,
      filters: [
        { key: 'all', label: 'All Members', count: membershipData.length, icon: Users },
        { key: 'active', label: 'Active', count: activeMembers.length, icon: UserCheck },
        { key: 'expired', label: 'Expired', count: expiredMembers.length, icon: UserX },
        { key: 'sessions', label: 'With Sessions', count: membersWithSessions.length, icon: Dumbbell },
        { key: 'no-sessions', label: 'No Sessions', count: membershipData.length - membersWithSessions.length, icon: Clock }
      ]
    },
    {
      title: "Period Filters",
      icon: Calendar,
      filters: [
        { key: 'recent', label: 'Last 30 Days', count: recentMembers.length, icon: TrendingUp },
        { key: 'weekly', label: 'This Week', count: weeklyMembers.length, icon: Calendar },
        { key: 'expiring', label: 'Expiring Soon', count: expiringThisMonth.length, icon: Clock }
      ]
    },
    {
      title: "Location Filters",
      icon: MapPin,
      filters: availableLocations.slice(0, 4).map(location => ({
        key: `location-${location}`,
        label: location.split(',')[0] || location,
        count: membershipData.filter(m => m.location === location).length,
        icon: MapPin
      }))
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {filterGroups.map((group, groupIndex) => (
        <Card key={group.title} className="p-6 border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <group.icon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{group.title}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.filters.map(filter => (
              <Button
                key={filter.key}
                variant={quickFilter === filter.key ? "default" : "outline"}
                onClick={() => onQuickFilterChange(filter.key)}
                className={`h-auto py-3 px-4 flex items-center gap-3 transition-all duration-300 ${
                  quickFilter === filter.key 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                    : 'border-border/50 hover:bg-accent/50 hover:scale-105'
                }`}
              >
                <filter.icon className="h-4 w-4" />
                <span className="font-medium">{filter.label}</span>
                <Badge 
                  variant={quickFilter === filter.key ? "secondary" : "outline"}
                  className={`ml-1 transition-colors duration-300 ${
                    quickFilter === filter.key ? 'bg-primary-foreground/20' : ''
                  }`}
                >
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
