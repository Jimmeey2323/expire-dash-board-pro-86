
export interface MembershipData {
  uniqueId: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipName: string;
  endDate: string;
  location: string;
  sessionsLeft: number;
  itemId: string;
  orderDate: string;
  soldBy: string;
  membershipId: string;
  frozen: string;
  paid: string;
  status: 'Active' | 'Expired';
}

export interface FilterOptions {
  status: string[];
  locations: string[];
  membershipTypes: string[];
  dateRange: {
    start: string;
    end: string;
  };
  sessionsRange: {
    min: number;
    max: number;
  };
}
