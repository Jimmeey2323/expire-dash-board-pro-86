
import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Search, ArrowUpDown } from "lucide-react";
import { MembershipData } from "@/types/membership";

interface DataTableProps {
  data: MembershipData[];
  title: string;
  className?: string;
}

type SortField = keyof MembershipData;
type SortDirection = 'asc' | 'desc';

export const DataTable = ({ data, title, className = '' }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('endDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, searchTerm, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <Card className={`bg-gray-900 border-gray-700 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 w-64"
              />
            </div>
            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
              {filteredAndSortedData.length} records
            </Badge>
          </div>
        </div>

        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-800 border-gray-700">
                <TableHead className="text-gray-300">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('memberId')}
                  >
                    Member ID {getSortIcon('memberId')}
                  </Button>
                </TableHead>
                <TableHead className="text-gray-300">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('firstName')}
                  >
                    Name {getSortIcon('firstName')}
                  </Button>
                </TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('membershipName')}
                  >
                    Membership {getSortIcon('membershipName')}
                  </Button>
                </TableHead>
                <TableHead className="text-gray-300">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('endDate')}
                  >
                    End Date {getSortIcon('endDate')}
                  </Button>
                </TableHead>
                <TableHead className="text-gray-300">Location</TableHead>
                <TableHead className="text-gray-300">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('sessionsLeft')}
                  >
                    Sessions {getSortIcon('sessionsLeft')}
                  </Button>
                </TableHead>
                <TableHead className="text-gray-300">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('status')}
                  >
                    Status {getSortIcon('status')}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((member) => (
                <TableRow key={member.uniqueId} className="border-gray-700 hover:bg-gray-800/50">
                  <TableCell className="text-white font-mono">{member.memberId}</TableCell>
                  <TableCell className="text-white">
                    {member.firstName} {member.lastName}
                  </TableCell>
                  <TableCell className="text-gray-300">{member.email}</TableCell>
                  <TableCell className="text-gray-300">{member.membershipName}</TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(member.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-gray-300">{member.location}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={member.sessionsLeft > 0 ? "default" : "secondary"}>
                      {member.sessionsLeft}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.status === 'Active' ? "default" : "destructive"}>
                      {member.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-gray-400 text-sm">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
