import type {
  TicketChannel,
  TicketPriority,
  TicketStatus,
} from '@prisma/client';

export type TicketSortBy =
  | 'createdAt'
  | 'updatedAt'
  | 'priority'
  | 'status'
  | 'publicKey';

export interface TicketListFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  channel?: TicketChannel[];
  requesterId?: string;
  requesterEmail?: string;
  assigneeEmail?: string;
  search?: string;
  sortBy: TicketSortBy;
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export type TicketStatusCounts = Record<TicketStatus, number>;
