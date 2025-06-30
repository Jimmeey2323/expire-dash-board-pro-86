
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/MetricCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { DataTable } from "@/components/DataTable";
import { MembershipChart } from "@/components/MembershipChart";
import { googleSheetsService } from "@/services/googleSheets";
import { MembershipData, FilterOptions } from "@/types/membership";
import { 
  Users, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  Filter,
  Dumbbell,
  MapPin,
  Calendar,
  Activity,
  RefreshCw
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
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch membership data. Using sample data for demonstration.");
    }
  }, [error]);

  const applyFilters = (data: MembershipData[]): MembershipData[] => {
    return data.filter(member => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(member.status)) {
        return false;
      }

      // Location filter
      if (filters.locations.length > 0 && !filters.locations.includes(member.location)) {
        return false;
      }

      // Membership type filter
      if (filters.membershipTypes.length > 0 && !filters.membershipTypes.includes(member.membershipName)) {
        return false;
      }

      // Sessions range filter
      if (member.sessionsLeft < filters.sessionsRange.min || member.sessionsLeft > filters.sessionsRange.max) {
        return false;
      }

      // Date range filter
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
    switch (quickFilter) {
      case 'active':
        return data.filter(member => member.status === 'Active');
      case 'expired':
        return data.filter(member => member.status === 'Expired');
      case 'sessions':
        return data.filter(member => member.sessionsLeft > 0);
      case 'no-sessions':
        return data.filter(member => member.sessionsLeft === 0);
      default:
        return data;
    }
  };

  const filteredData = applyQuickFilter(applyFilters(membershipData));
  const activeMembers = membershipData.filter(m => m.status === 'Active');
  const expiredMembers = membershipData.filter(m => m.status === 'Expired');
  const membersWithSessions = membershipData.filter(m => m.sessionsLeft > 0);

  const availableLocations = [...new Set(membershipData.map(m => m.location).filter(l => l && l !== '-'))];
  const availableMembershipTypes = [...new Set(membershipData.map(m => m.membershipName))];

  const handleRefresh = () => {
    refetch();
    toast.success("Data refreshed successfully!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
          <p className="text-white text-lg">Loading membership data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Studio Dashboard
            </h1>
            <p className="text-gray-400">Comprehensive membership management and analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleRefresh} variant="outline" className="border-gray-600">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsFilterOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'all', label: 'All Members', count: membershipData.length },
            { key: 'active', label: 'Active', count: activeMembers.length },
            { key: 'expired', label: 'Expired', count: expiredMembers.length },
            { key: 'sessions', label: 'With Sessions', count: membersWithSessions.length },
            { key: 'no-sessions', label: 'No Sessions', count: membershipData.length - membersWithSessions.length }
          ].map(filter => (
            <Button
              key={filter.key}
              variant={quickFilter === filter.key ? "default" : "outline"}
              onClick={() => setQuickFilter(filter.key)}
              className="flex items-center gap-2"
            >
              {filter.label}
              <Badge variant="secondary" className="ml-1">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            value={membershipData.reduce((sum, m) => sum + m.sessionsLeft, 0)}
            icon={Dumbbell}
            change="+15% from last month"
            trend="up"
          />
        </div>

        {/* Charts */}
        <MembershipChart data={filteredData} />

        {/* Tabbed Data Tables */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-green-600">
              <UserCheck className="h-4 w-4 mr-2" />
              Active Members
            </TabsTrigger>
            <TabsTrigger value="expired" className="data-[state=active]:bg-red-600">
              <UserX className="h-4 w-4 mr-2" />
              Expired Members
            </TabsTrigger>
            <TabsTrigger value="sessions" className="data-[state=active]:bg-yellow-600">
              <Dumbbell className="h-4 w-4 mr-2" />
              Sessions Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DataTable 
              data={filteredData} 
              title="All Members Overview"
            />
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <DataTable 
              data={filteredData.filter(m => m.status === 'Active')} 
              title="Active Members"
            />
          </TabsContent>

          <TabsContent value="expired" className="space-y-6">
            <DataTable 
              data={filteredData.filter(m => m.status === 'Expired')} 
              title="Expired Members"
            />
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DataTable 
                data={filteredData.filter(m => m.sessionsLeft > 0)} 
                title="Members with Remaining Sessions"
              />
              <DataTable 
                data={filteredData.filter(m => m.sessionsLeft === 0)} 
                title="Members with No Sessions"
              />
            </div>
          </TabsContent>
        </Tabs>

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
