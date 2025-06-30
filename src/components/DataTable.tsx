
import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Search, ArrowUpDown, MessageSquare, FileText } from "lucide-react";
import { MembershipData } from "@/types/membership";
import { MemberAnnotations } from "./MemberAnnotations";

interface DataTableProps {
  data: MembershipData[];
  title: string;
  className?: string;
  onAnnotationUpdate?: (memberId: string, comments: string, notes: string, tags: string[]) => void;
}

type SortField = keyof MembershipData;
type SortDirection = 'asc' | 'desc';

export const DataTable = ({ data, title, className = '', onAnnotationUpdate }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('endDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<MembershipData | null>(null);
  const [isAnnotationOpen, setIsAnnotationOpen] = useState(false);
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

  const handleOpenAnnotations = (member: MembershipData) => {
    setSelectedMember(member);
    setIsAnnotationOpen(true);
  };

  const handleAnnotationSave = (memberId: string, comments: string, notes: string, tags: string[]) => {
    if (onAnnotationUpdate) {
      onAnnotationUpdate(memberId, comments, notes, tags);
    }
    setIsAnnotationOpen(false);
    setSelectedMember(null);
  };

  return (
    <>
      <Card className={`bg-card/50 backdrop-blur-sm border-border/50 ${className}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 w-64"
                />
              </div>
              <Badge variant="secondary" className="bg-muted/50 text-muted-foreground">
                {filteredAndSortedData.length} records
              </Badge>
            </div>
          </div>

          <div className="border border-border/50 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 border-border/50">
                  <TableHead className="text-muted-foreground">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort('memberId')}
                    >
                      Member ID {getSortIcon('memberId')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort('firstName')}
                    >
                      Name {getSortIcon('firstName')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort('membershipName')}
                    >
                      Membership {getSortIcon('membershipName')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort('endDate')}
                    >
                      End Date {getSortIcon('endDate')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">Location</TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort('sessionsLeft')}
                    >
                      Sessions {getSortIcon('sessionsLeft')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort('status')}
                    >
                      Status {getSortIcon('status')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">Tags</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((member) => (
                  <TableRow key={member.uniqueId} className="border-border/50 hover:bg-muted/25">
                    <TableCell className="text-foreground font-mono">{member.memberId}</TableCell>
                    <TableCell className="text-foreground">
                      {member.firstName} {member.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{member.email}</TableCell>
                    <TableCell className="text-muted-foreground">{member.membershipName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(member.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{member.location}</TableCell>
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
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.tags?.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {member.tags && member.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenAnnotations(member)}
                          className="h-8 w-8 p-0"
                          title="Add notes, comments & tags"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        {(member.comments || member.notes) && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-2" title="Has annotations" />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-muted-foreground text-sm">
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

      <MemberAnnotations
        member={selectedMember}
        isOpen={isAnnotationOpen}
        onClose={() => {
          setIsAnnotationOpen(false);
          setSelectedMember(null);
        }}
        onSave={handleAnnotationSave}
      />
    </>
  );
};
