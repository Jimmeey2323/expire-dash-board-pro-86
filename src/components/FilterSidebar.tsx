
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Calendar, MapPin, CreditCard, Activity } from "lucide-react";
import { FilterOptions } from "@/types/membership";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableLocations: string[];
  availableMembershipTypes: string[];
}

export const FilterSidebar = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  availableLocations,
  availableMembershipTypes
}: FilterSidebarProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      status: [],
      locations: [],
      membershipTypes: [],
      dateRange: { start: '', end: '' },
      sessionsRange: { min: 0, max: 100 }
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const toggleArrayFilter = (key: keyof Pick<FilterOptions, 'status' | 'locations' | 'membershipTypes'>, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <Card className="w-80 h-full bg-gray-900 border-gray-700 rounded-none border-r animate-slide-in-right">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Advanced Filters</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 flex items-center gap-2 mb-3">
                <Activity className="h-4 w-4" />
                Status
              </Label>
              <div className="flex flex-wrap gap-2">
                {['Active', 'Expired'].map(status => (
                  <Badge
                    key={status}
                    variant={localFilters.status.includes(status) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleArrayFilter('status', status)}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-700" />

            <div>
              <Label className="text-gray-300 flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4" />
                Locations
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableLocations.map(location => (
                  <Badge
                    key={location}
                    variant={localFilters.locations.includes(location) ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => toggleArrayFilter('locations', location)}
                  >
                    {location}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-700" />

            <div>
              <Label className="text-gray-300 flex items-center gap-2 mb-3">
                <CreditCard className="h-4 w-4" />
                Membership Types
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableMembershipTypes.map(type => (
                  <Badge
                    key={type}
                    variant={localFilters.membershipTypes.includes(type) ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => toggleArrayFilter('membershipTypes', type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-700" />

            <div>
              <Label className="text-gray-300 flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4" />
                Date Range
              </Label>
              <div className="space-y-2">
                <Input
                  type="date"
                  value={localFilters.dateRange.start}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-600"
                />
                <Input
                  type="date"
                  value={localFilters.dateRange.end}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
            </div>

            <Separator className="bg-gray-700" />

            <div>
              <Label className="text-gray-300 mb-3 block">Sessions Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={localFilters.sessionsRange.min}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    sessionsRange: { ...prev.sessionsRange, min: parseInt(e.target.value) || 0 }
                  }))}
                  className="bg-gray-800 border-gray-600"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={localFilters.sessionsRange.max}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    sessionsRange: { ...prev.sessionsRange, max: parseInt(e.target.value) || 100 }
                  }))}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
