export type TicketStatus = 'NEW' | 'OPEN' | 'PENDING' | 'RESOLVED' | 'CLOSED';

export type TicketPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type TicketChannel = 'EMAIL' | 'WEB' | 'PHONE' | 'API';

export interface Requester {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  publicKey: string;
  requesterId: string;
  subject: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  channel: TicketChannel;
  assigneeName: string | null;
  assigneeEmail: string | null;
  createdAt: string;
  updatedAt: string;
  requester: Requester;
}

export type TicketSortBy = 'createdAt' | 'updatedAt' | 'priority' | 'status' | 'publicKey';

export type TicketStatusCounts = Record<TicketStatus, number>;

export interface TicketListMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  sortBy: TicketSortBy;
  sortOrder: 'asc' | 'desc';
  statusCounts: TicketStatusCounts;
}

export interface TicketListResponse {
  data: Ticket[];
  meta: TicketListMeta;
}

export interface TicketListParams {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  channel?: TicketChannel[];
  requesterId?: string;
  requesterEmail?: string;
  assigneeEmail?: string;
  search?: string;
  sortBy?: TicketSortBy;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}
