import type { UiIconName } from '@ui/UiIcon/icon.types';

export type MobileStatus = 'new' | 'in-progress' | 'closed';

export interface UiMobileTicketQueueTab {
  label: string;
  active?: boolean;
  count?: number;
}

export interface UiMobileTicketQueueTicket {
  id: string;
  title: string;
  description: string;
  requester: string;
  avatarTone: string;
  updatedAt: string;
  status: MobileStatus;
  alert?: boolean;
  crossedOut?: boolean;
}

export interface UiMobileTicketQueueBottomNavItem {
  label: string;
  icon: Extract<UiIconName, 'home' | 'tickets' | 'notification' | 'profile'>;
  active?: boolean;
}

export interface UiMobileTicketQueueProps {
  title: string;
  dateLabel: string;
  tabs: UiMobileTicketQueueTab[];
  tickets: UiMobileTicketQueueTicket[];
  statusLabel: Record<MobileStatus, string>;
  bottomNav: UiMobileTicketQueueBottomNavItem[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  canPrevPage?: boolean;
  canNextPage?: boolean;
}

