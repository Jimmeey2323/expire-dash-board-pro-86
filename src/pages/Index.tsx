
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/MetricCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { DataTable } from "@/components/DataTable";
import { MembershipChart } from "@/components/MembershipChart";
import { QuickFilters } from "@/components/QuickFilters";
import { ThemeToggle } from "@/components/ThemeToggle";
import { googleSheetsService } from "@/services/googleSheets";
import { MembershipData, FilterOptions } from "@/types/membership";
import { 
  Users, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  Filter,
  Dumbbell,
  Activity,
  RefreshCw,
  Settings,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    locations: [],
    membershipTypes: [],
    dateRange: { start: '', end: '' },
    sessionsRange: { min: 0, max: 100 }
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState<string>('all');

  const { data: membershipData = [], isLoading, error, refetch } = useQuery({
    queryKey: ['membershipData'],
    queryFn: () => googleSheetsService.getMembershipData(),
    refetchInterval: 300000,
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch membership data. Using sample data for demonstration.");
    }
  }, [error]);

  const applyFilters = (data: MembershipData[]): MembershipData[] => {
    return data.filter(member => {
      if (filters.status.length > 0 && !filters.status.includes(member.status)) {
        return false;
      }
      if (filters.locations.length > 0 && !filters.locations.includes(member.location)) {
        return false;
      }
      if (filters.membershipTypes.length > 0 && !filters.membershipTypes.includes(member.membershipName)) {
        return false;
      }
      if (member.sessionsLeft < filters.sessionsRange.min || member.sessionsLeft > filters.sessionsRange.max) {
        return false;
      }
      if (filters.dateRange.start && new Date(member.endDate) < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange.end && new Date(member.endDate) > new Date(filters.dateRange.end)) {
        return false;
      }
      return true;
    });
  };

  const applyQuickFilter = (data: MembershipData[]): MembershipData[] => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    switch (quickFilter) {
      case 'active':
        return data.filter(member => member.status === 'Active');
      case 'expired':
        return data.filter(member => member.status === 'Expired');
      case 'sessions':
        return data.filter(member => member.sessionsLeft > 0);
      case 'no-sessions':
        return data.filter(member => member.sessionsLeft === 0);
      case 'recent':
        return data.filter(member => new Date(member.orderDate) >= thirtyDaysAgo);
      case 'weekly':
        return data.filter(member => new Date(member.orderDate) >= sevenDaysAgo);
      case 'expiring':
        return data.filter(member => {
          const endDate = new Date(member.endDate);
          return endDate >= now && endDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        });
      default:
        if (quickFilter.startsWith('location-')) {
          const location = quickFilter.replace('location-', '');
          return data.filter(member => member.location === location);
        }
        return data;
    }
  };

  const filteredData = applyQuickFilter(applyFilters(membershipData));
  const activeMembers = membershipData.filter(member => member.status === 'Active');
  const expiredMembers = membershipData.filter(member => member.status === 'Expired');
  const membersWithSessions = membershipData.filter(member => member.sessionsLeft > 0);

  const availableLocations = [...new Set(membershipData.map(member => member.location).filter(l => l && l !== '-'))];
  const availableMembershipTypes = [...new Set(membershipData.map(member => member.membershipName))];

  const handleRefresh = () => {
    refetch();
    toast.success("Data refreshed successfully!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative">
            <RefreshCw className="h-16 w-16 text-primary animate-spin mx-auto" />
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-foreground">Loading Dashboard</p>
            <p className="text-muted-foreground">Fetching membership data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="relative container mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary to-purple-600 bg-clip-text text-transparent">
              Studio Dashboard
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Advanced membership management & analytics platform
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button onClick={handleRefresh} variant="outline" className="border-border/50 hover:bg-accent/50 transition-all duration-300">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsFilterOpen(true)} className="bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Enhanced Quick Filters */}
        <QuickFilters
          quickFilter={quickFilter}
          onQuickFilterChange={setQuickFilter}
          membershipData={membershipData}
          availableLocations={availableLocations}
        />

        {/* Enhanced Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          <MetricCard
            title="Total Members"
            value={membershipData.length}
            icon={Users}
            change="+12% from last month"
            trend="up"
          />
          <MetricCard
            title="Active Members"
            value={activeMembers.length}
            icon={UserCheck}
            change="+5% from last month"
            trend="up"
          />
          <MetricCard
            title="Expired Members"
            value={expiredMembers.length}
            icon={UserX}
            change="-8% from last month"
            trend="down"
          />
          <MetricCard
            title="Total Sessions"
            value={membershipData.reduce((sum, member) => sum + member.sessionsLeft, 0)}
            icon={Dumbbell}
            change="+15% from last month"
            trend="up"
          />
        </div>

        {/* Enhanced Charts */}
        <div className="animate-fade-in">
          <MembershipChart data={filteredData} />
        </div>

        {/* Enhanced Tabbed Data Tables */}
        <div className="animate-fade-in">
          <Tabs defaultValue="overview" className="space-y-6">
            <Card className="p-1 border-border/50 bg-card/30 backdrop-blur-sm">
              <TabsList className="grid w-full grid-cols-4 bg-transparent gap-1">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="active" 
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all duration-300"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Active Members
                </TabsTrigger>
                <TabsTrigger 
                  value="expired" 
                  className="data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-300"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Expired Members
                </TabsTrigger>
                <TabsTrigger 
                  value="sessions" 
                  className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white transition-all duration-300"
                >
                  <Dumbbell className="h-4 w-4 mr-2" />
                  Sessions Analysis
                </TabsTrigger>
              </TabsList>
            </Card>

            <TabsContent value="overview" className="space-y-6">
              <DataTable 
                data={filteredData} 
                title="All Members Overview"
              />
            </TabsContent>

            <TabsContent value="active" className="space-y-6">
              <DataTable 
                data={filteredData.filter(member => member.status === 'Active')} 
                title="Active Members"
              />
            </TabsContent>

            <TabsContent value="expired" className="space-y-6">
              <DataTable 
                data={filteredData.filter(member => member.status === 'Expired')} 
                title="Expired Members"
              />
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DataTable 
                  data={filteredData.filter(member => member.sessionsLeft > 0)} 
                  title="Members with Remaining Sessions"
                />
                <DataTable 
                  data={filteredData.filter(member => member.sessionsLeft === 0)} 
                  title="Members with No Sessions"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Filter Sidebar */}
        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
          availableLocations={availableLocations}
          availableMembershipTypes={availableMembershipTypes}
        />
      </div>
    </div>
  );
};

export default Index;
