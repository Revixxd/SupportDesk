export type TicketManagementPriority = 'high' | 'medium' | 'low';

export type TicketManagementStatus = 'New' | 'Open' | 'Pending' | 'Resolved' | 'Closed';

export interface TicketManagementTab {
  label: string;
  count: number;
  active?: boolean;
}

export interface TicketManagementItem {
  id: string;
  subject: string;
  description: string;
  requester: string;
  requesterRole: string;
  priority: TicketManagementPriority;
  status: TicketManagementStatus;
  statusVariant: 'info' | 'warning' | 'success' | 'danger' | 'neutral';
  updatedAt: string;
  avatarTone: string;
}

export interface UiTicketManagementProps {
  tabs: TicketManagementTab[];
  tickets: TicketManagementItem[];
  priorityLabel: Record<TicketManagementPriority, string>;
  footerLabel: string;
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
}

