import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTickets } from '../stores/tickets';
import type { TicketPriority, TicketStatus } from '../types/tickets';
import type {
  DesktopPriorityLabel,
  MobileBottomNavItem,
  MobileStatusLabel,
} from './useTicketsStore.types';
import {
  formatDateTime,
  formatRelativeTime,
  getAvatarTone,
  getRequesterName,
} from '../utils/ticket-format';

const desktopStatusLabel: Record<TicketStatus, 'New' | 'Open' | 'Pending' | 'Resolved' | 'Closed'> =
  {
    NEW: 'New',
    OPEN: 'Open',
    PENDING: 'Pending',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
  };

const desktopPriorityLabel: Record<TicketPriority, 'Low' | 'Medium' | 'High' | 'Urgent'> = {
  LOW: 'Low',
  NORMAL: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

const mobileStatusMap: Record<TicketStatus, 'new' | 'in-progress' | 'closed'> = {
  NEW: 'new',
  OPEN: 'new',
  PENDING: 'in-progress',
  RESOLVED: 'closed',
  CLOSED: 'closed',
};

const desktopStatusVariant: Record<
  TicketStatus,
  'info' | 'warning' | 'success' | 'danger' | 'neutral'
> = {
  NEW: 'info',
  OPEN: 'info',
  PENDING: 'warning',
  RESOLVED: 'success',
  CLOSED: 'neutral',
};

const desktopPriorityClass: Record<TicketPriority, 'low' | 'medium' | 'high'> = {
  LOW: 'low',
  NORMAL: 'medium',
  HIGH: 'high',
  URGENT: 'high',
};

const mobileBottomNav: MobileBottomNavItem[] = [
  { label: 'Home', icon: 'home', active: false },
  { label: 'Tickets', icon: 'tickets', active: true },
  { label: 'Alerts', icon: 'notification', active: false },
  { label: 'Profile', icon: 'profile', active: false },
];

const priorityLabel: DesktopPriorityLabel = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const statusLabel: MobileStatusLabel = {
  new: 'New',
  'in-progress': 'In Progress',
  closed: 'Closed',
};

export const useTicketsStore = () => {
  const ticketsStore = useTickets();
  const { items, meta, isListLoading, isDetailLoading, currentTicket, error, listParams } =
    storeToRefs(ticketsStore);

  const activeStatus = computed(() => listParams.value.status?.[0] ?? null);
  const countsOnPage = computed(() => {
    return items.value.reduce(
      (acc, ticket) => {
        acc[ticket.status] += 1;
        return acc;
      },
      {
        NEW: 0,
        OPEN: 0,
        PENDING: 0,
        RESOLVED: 0,
        CLOSED: 0,
      } as Record<TicketStatus, number>,
    );
  });

  const tabs = computed(() => {
    const active = activeStatus.value;

    return [
      { label: 'All Tickets', count: meta.value.total, active: active === null },
      { label: 'New', count: countsOnPage.value.NEW, active: active === 'NEW' },
      { label: 'Open', count: countsOnPage.value.OPEN, active: active === 'OPEN' },
      { label: 'Pending', count: countsOnPage.value.PENDING, active: active === 'PENDING' },
      { label: 'Resolved', count: countsOnPage.value.RESOLVED, active: active === 'RESOLVED' },
      { label: 'Closed', count: countsOnPage.value.CLOSED, active: active === 'CLOSED' },
    ];
  });

  const desktopTickets = computed(() => {
    return items.value.map((ticket) => {
      const requesterName = getRequesterName(ticket);

      return {
        id: ticket.publicKey,
        subject: ticket.subject,
        description: ticket.description ?? 'No description',
        requester: requesterName,
        requesterRole: ticket.requester.email,
        priority: desktopPriorityClass[ticket.priority],
        status: desktopStatusLabel[ticket.status],
        statusVariant: desktopStatusVariant[ticket.status],
        updatedAt: formatRelativeTime(ticket.updatedAt),
        avatarTone: getAvatarTone(requesterName),
      };
    });
  });

  const mobileTickets = computed(() => {
    return items.value.map((ticket) => {
      const requesterName = getRequesterName(ticket);

      return {
        id: ticket.publicKey,
        title: ticket.subject,
        description: ticket.description ?? 'No description',
        requester: requesterName,
        avatarTone: getAvatarTone(requesterName),
        updatedAt: formatRelativeTime(ticket.updatedAt),
        status: mobileStatusMap[ticket.status],
        alert: ticket.priority === 'URGENT',
        crossedOut: ticket.status === 'RESOLVED' || ticket.status === 'CLOSED',
      };
    });
  });

  const footerLabel = computed(() => {
    if (meta.value.total === 0) {
      return 'No tickets found';
    }

    const from = (meta.value.page - 1) * meta.value.pageSize + 1;
    const to = Math.min(meta.value.page * meta.value.pageSize, meta.value.total);

    return `Showing ${from} to ${to} of ${meta.value.total} results`;
  });

  const currentTicketView = computed(() => {
    if (!currentTicket.value) {
      return null;
    }

    const requesterName = getRequesterName(currentTicket.value);

    return {
      id: currentTicket.value.publicKey,
      subject: currentTicket.value.subject,
      description: currentTicket.value.description ?? 'No description',
      requesterName,
      requesterEmail: currentTicket.value.requester.email,
      status: desktopStatusLabel[currentTicket.value.status],
      priority: desktopPriorityLabel[currentTicket.value.priority],
      channel: currentTicket.value.channel,
      assigneeName: currentTicket.value.assigneeName ?? 'Unassigned',
      assigneeEmail: currentTicket.value.assigneeEmail ?? 'No email',
      updatedAt: formatDateTime(currentTicket.value.updatedAt),
      createdAt: formatDateTime(currentTicket.value.createdAt),
      avatarTone: getAvatarTone(requesterName),
    };
  });

  const setStatusByTab = async (label: string) => {
    const tabToStatus: Record<string, TicketStatus | null> = {
      'All Tickets': null,
      New: 'NEW',
      Open: 'OPEN',
      Pending: 'PENDING',
      Resolved: 'RESOLVED',
      Closed: 'CLOSED',
    };

    const status = tabToStatus[label];

    if (status) {
      await ticketsStore.setStatusFilter([status]);
      return;
    }

    await ticketsStore.setStatusFilter(undefined);
  };

  const setMobileStatusByTab = async (label: string) => {
    const tabToStatus: Record<string, TicketStatus[] | null> = {
      All: null,
      New: ['NEW', 'OPEN'],
      'In Progress': ['PENDING'],
      Closed: ['RESOLVED', 'CLOSED'],
    };

    const statuses = tabToStatus[label];

    if (statuses) {
      await ticketsStore.setStatusFilter(statuses);
      return;
    }

    await ticketsStore.setStatusFilter(undefined);
  };

  const canNextPage = computed(() => meta.value.page < meta.value.totalPages);
  const canPrevPage = computed(() => meta.value.page > 1);

  const nextPage = async () => {
    if (!canNextPage.value) {
      return;
    }

    await ticketsStore.changePage(meta.value.page + 1);
  };

  const prevPage = async () => {
    if (!canPrevPage.value) {
      return;
    }

    await ticketsStore.changePage(meta.value.page - 1);
  };

  return {
    ticketsStore,
    tabs,
    desktopTickets,
    mobileTickets,
    footerLabel,
    meta,
    currentTicketView,
    isListLoading,
    isDetailLoading,
    error,
    priorityLabel,
    statusLabel,
    mobileBottomNav,
    mobileTabs: computed(() => [
      { label: 'All', active: activeStatus.value === null },
      { label: 'New', active: activeStatus.value === 'NEW' || activeStatus.value === 'OPEN' },
      { label: 'In Progress', active: activeStatus.value === 'PENDING' },
      {
        label: 'Closed',
        active: activeStatus.value === 'CLOSED' || activeStatus.value === 'RESOLVED',
      },
    ]),
    canPrevPage,
    canNextPage,
    fetchTickets: ticketsStore.fetchTickets,
    fetchTicketById: ticketsStore.fetchTicketById,
    setStatusByTab,
    setMobileStatusByTab,
    changePage: ticketsStore.changePage,
    prevPage,
    nextPage,
  };
};
