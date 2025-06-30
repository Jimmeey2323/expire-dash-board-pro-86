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
  BarChart3,
  Sparkles,
  Crown,
  Zap
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
  const [localMembershipData, setLocalMembershipData] = useState<MembershipData[]>([]);

  const { data: membershipData = [], isLoading, error, refetch } = useQuery({
    queryKey: ['membershipData'],
    queryFn: () => googleSheetsService.getMembershipData(),
    refetchInterval: 300000,
  });

  useEffect(() => {
    if (membershipData) {
      setLocalMembershipData(membershipData);
    }
  }, [membershipData]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch membership data. Using sample data for demonstration.");
    }
  }, [error]);

  const handleAnnotationUpdate = (memberId: string, comments: string, notes: string, tags: string[]) => {
    setLocalMembershipData(prev => 
      prev.map(member => 
        member.memberId === memberId 
          ? { ...member, comments, notes, tags }
          : member
      )
    );
  };

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

  const filteredData = applyQuickFilter(applyFilters(localMembershipData));
  const activeMembers = localMembershipData.filter(member => member.status === 'Active');
  const expiredMembers = localMembershipData.filter(member => member.status === 'Expired');
  const membersWithSessions = localMembershipData.filter(member => member.sessionsLeft > 0);

  const availableLocations = [...new Set(localMembershipData.map(member => member.location).filter(l => l && l !== '-'))];
  const availableMembershipTypes = [...new Set(localMembershipData.map(member => member.membershipName))];

  const handleRefresh = () => {
    refetch();
    toast.success("Data refreshed successfully!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-20" />
            <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl border border-white/20">
              <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Loading Dashboard
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Fetching membership data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500">
      {/* Premium background elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
      <div className="fixed top-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000" />
      <div className="fixed bottom-0 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000" />
      
      <div className="relative container mx-auto p-8 space-y-10">
        {/* Premium Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                  Studio Elite
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <p className="text-lg text-slate-600 dark:text-slate-300 font-semibold">
                    Premium Membership Analytics
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              className="group border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Refresh Data
            </Button>
            <Button 
              onClick={() => setIsFilterOpen(true)} 
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 border-0"
            >
              <Filter className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Advanced Filters
              <Zap className="h-4 w-4 ml-2 text-yellow-300" />
            </Button>
          </div>
        </div>

        {/* Enhanced Quick Filters */}
        <div className="animate-fade-in">
          <QuickFilters
            quickFilter={quickFilter}
            onQuickFilterChange={setQuickFilter}
            membershipData={localMembershipData}
            availableLocations={availableLocations}
          />
        </div>

        {/* Premium Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 animate-fade-in">
          <MetricCard
            title="Total Members"
            value={localMembershipData.length}
            icon={Users}
            change="+12% from last month"
            trend="up"
            className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500"
          />
          <MetricCard
            title="Active Members"
            value={activeMembers.length}
            icon={UserCheck}
            change="+5% from last month"
            trend="up"
            className="group hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500"
          />
          <MetricCard
            title="Expired Members"
            value={expiredMembers.length}
            icon={UserX}
            change="-8% from last month"
            trend="down"
            className="group hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500"
          />
          <MetricCard
            title="Total Sessions"
            value={localMembershipData.reduce((sum, member) => sum + member.sessionsLeft, 0)}
            icon={Dumbbell}
            change="+15% from last month"
            trend="up"
            className="group hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
          />
        </div>

        {/* Premium Chart Section */}
        <div className="animate-fade-in">
          <MembershipChart data={filteredData} />
        </div>

        {/* Enhanced Tabbed Interface */}
        <div className="animate-fade-in">
          <Tabs defaultValue="overview" className="space-y-8">
            <Card className="p-2 border-2 border-white/20 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-2xl">
              <TabsList className="grid w-full grid-cols-4 bg-transparent gap-2 p-1">
                <TabsTrigger 
                  value="overview" 
                  className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl font-semibold"
                >
                  <Activity className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="active" 
                  className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl font-semibold"
                >
                  <UserCheck className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Active
                </TabsTrigger>
                <TabsTrigger 
                  value="expired" 
                  className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl font-semibold"
                >
                  <UserX className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Expired
                </TabsTrigger>
                <TabsTrigger 
                  value="sessions" 
                  className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl font-semibold"
                >
                  <Dumbbell className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Sessions
                </TabsTrigger>
              </TabsList>
            </Card>

            <TabsContent value="overview" className="space-y-6">
              <DataTable 
                data={filteredData} 
                title="All Members Overview"
                onAnnotationUpdate={handleAnnotationUpdate}
              />
            </TabsContent>

            <TabsContent value="active" className="space-y-6">
              <DataTable 
                data={filteredData.filter(member => member.status === 'Active')} 
                title="Active Members"
                onAnnotationUpdate={handleAnnotationUpdate}
              />
            </TabsContent>

            <TabsContent value="expired" className="space-y-6">
              <DataTable 
                data={filteredData.filter(member => member.status === 'Expired')} 
                title="Expired Members"
                onAnnotationUpdate={handleAnnotationUpdate}
              />
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DataTable 
                  data={filteredData.filter(member => member.sessionsLeft > 0)} 
                  title="Members with Remaining Sessions"
                  onAnnotationUpdate={handleAnnotationUpdate}
                />
                <DataTable 
                  data={filteredData.filter(member => member.sessionsLeft === 0)} 
                  title="Members with No Sessions"
                  onAnnotationUpdate={handleAnnotationUpdate}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

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
