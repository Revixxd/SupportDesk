import { defineStore } from 'pinia';
import { http } from '../api/http';
import type {
  Ticket,
  TicketListMeta,
  TicketListParams,
  TicketListResponse,
  TicketStatus,
} from '../types/tickets';
import type { TicketsState } from './tickets.types';

const DEFAULT_META: TicketListMeta = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 1,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  statusCounts: {
    NEW: 0,
    OPEN: 0,
    PENDING: 0,
    RESOLVED: 0,
    CLOSED: 0,
  },
};

const parseApiError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { error?: string } } }).response;
    const message = response?.data?.error;

    if (message) {
      return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error while loading tickets.';
};

const toQueryParams = (params: TicketListParams) => {
  return {
    ...params,
    status: params.status?.join(','),
    priority: params.priority?.join(','),
    channel: params.channel?.join(','),
  };
};

export const useTickets = defineStore('tickets', {
  state: (): TicketsState => ({
    items: [],
    currentTicket: null,
    meta: { ...DEFAULT_META },
    listParams: {
      page: 1,
      pageSize: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
    isListLoading: false,
    isDetailLoading: false,
    error: null,
  }),
  actions: {
    async fetchTickets(overrides: Partial<TicketListParams> = {}) {
      const nextParams: TicketListParams = {
        ...this.listParams,
        ...overrides,
      };

      this.listParams = {
        page: nextParams.page ?? 1,
        pageSize: nextParams.pageSize ?? this.listParams.pageSize,
        sortBy: nextParams.sortBy ?? this.listParams.sortBy,
        sortOrder: nextParams.sortOrder ?? this.listParams.sortOrder,
        status: nextParams.status,
      };

      this.isListLoading = true;
      this.error = null;

      try {
        const response = await http.get<TicketListResponse>('/tickets', {
          params: toQueryParams(nextParams),
        });

        this.items = response.data.data;
        this.meta = response.data.meta;
      } catch (error) {
        this.error = parseApiError(error);
        this.items = [];
        this.meta = { ...DEFAULT_META };
      } finally {
        this.isListLoading = false;
      }
    },

    async fetchTicketById(id: string) {
      this.isDetailLoading = true;
      this.error = null;

      try {
        const response = await http.get<Ticket>(`/tickets/${id}`);
        this.currentTicket = response.data;
      } catch (error) {
        this.error = parseApiError(error);
        this.currentTicket = null;
      } finally {
        this.isDetailLoading = false;
      }
    },

    async changePage(page: number) {
      if (page < 1 || page > this.meta.totalPages) {
        return;
      }

      await this.fetchTickets({ page });
    },

    async setStatusFilter(status?: TicketStatus[]) {
      await this.fetchTickets({ status, page: 1 });
    },
  },
});
