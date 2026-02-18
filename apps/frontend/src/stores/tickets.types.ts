import type { Ticket, TicketListMeta, TicketListParams, TicketStatus } from '../types/tickets';

export interface TicketsState {
  items: Ticket[];
  currentTicket: Ticket | null;
  meta: TicketListMeta;
  listParams: Required<Pick<TicketListParams, 'page' | 'pageSize' | 'sortBy' | 'sortOrder'>> & {
    status?: TicketStatus[];
  };
  isListLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;
}

