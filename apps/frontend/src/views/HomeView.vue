<template>
  <div v-if="!isMobile">
    <UiTicketManagement
      :tabs="tabs"
      :tickets="tempTickets"
      :status-variant="statusVariant"
      :priority-label="priorityLabel"
      footer-label="Showing 1 to 5 of 45 results"
    />
  </div>

  <div v-else>
    <UiMobileTicketQueue
      title="Ticket Queue"
      date-label="Monday, Oct 24"
      :tabs="mobileTabs"
      :tickets="mobileTickets"
      :status-label="mobileStatusLabel"
      :bottom-nav="mobileBottomNav"
    />
  </div>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import UiMobileTicketQueue from '@ui/UiMobileTicketQueue/UiMobileTicketQueue.vue';
import UiTicketManagement from '@ui/UiTicketManagement/UiTicketManagement.vue';

type Priority = 'high' | 'medium' | 'low';
type Status = 'Open' | 'Pending' | 'Resolved';
type MobileStatus = 'new' | 'in-progress' | 'closed';
const isMobile = useMediaQuery('(max-width: 920px)');

const tabs = [
  { label: 'All Tickets', count: 45, active: true },
  { label: 'Open', count: 12, active: false },
  { label: 'Pending', count: 5, active: false },
  { label: 'Resolved', count: 28, active: false },
];

const tempTickets: Array<{
  id: string;
  subject: string;
  description: string;
  requester: string;
  requesterRole: string;
  priority: Priority;
  status: Status;
  updatedAt: string;
  avatarTone: string;
}> = [
  {
    id: '#TCK-2024',
    subject: 'Login failure on portal',
    description: 'User reports 403 error when accessing dashboard.',
    requester: 'Alice Smith',
    requesterRole: 'Enterprise Client',
    priority: 'high',
    status: 'Open',
    updatedAt: '2 hours ago',
    avatarTone: '#f7d8b2',
  },
  {
    id: '#TCK-2023',
    subject: 'Billing cycle discrepancy',
    description: 'Invoice #9923 shows incorrect amount for Oct.',
    requester: 'Michael Jordan',
    requesterRole: 'Standard User',
    priority: 'medium',
    status: 'Pending',
    updatedAt: '5 hours ago',
    avatarTone: '#8b5cf6',
  },
  {
    id: '#TCK-2022',
    subject: 'API rate limiting issue',
    description: 'Dev team needs temporary increase for testing.',
    requester: 'David Chen',
    requesterRole: 'Developer',
    priority: 'low',
    status: 'Resolved',
    updatedAt: '1 day ago',
    avatarTone: '#22a9d9',
  },
  {
    id: '#TCK-2021',
    subject: 'Feature Request: Dark Mode',
    description: 'User requesting native dark mode support.',
    requester: 'Sarah Ross',
    requesterRole: 'Beta Tester',
    priority: 'low',
    status: 'Open',
    updatedAt: '2 days ago',
    avatarTone: '#e11d8f',
  },
  {
    id: '#TCK-2020',
    subject: 'Account Locked',
    description: 'Multiple failed login attempts detected.',
    requester: 'Mark Wilson',
    requesterRole: 'Manager',
    priority: 'high',
    status: 'Pending',
    updatedAt: '2 days ago',
    avatarTone: '#8a6f56',
  },
];

const statusVariant: Record<Status, 'info' | 'warning' | 'success'> = {
  Open: 'info',
  Pending: 'warning',
  Resolved: 'success',
};

const priorityLabel: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const mobileTabs = [
  { label: 'All', active: true },
  { label: 'New', count: 4, active: false },
  { label: 'In Progress', active: false },
  { label: 'Closed', active: false },
];

const mobileTickets: Array<{
  id: string;
  title: string;
  description: string;
  requester: string;
  avatarTone: string;
  updatedAt: string;
  status: MobileStatus;
  alert?: boolean;
  crossedOut?: boolean;
}> = [
  {
    id: '#T-8832',
    title: 'Login failure on portal',
    description:
      'User is reporting a 403 error when attempting to access the dashboard from a new device.',
    requester: 'Alice Freeman',
    avatarTone: '#f2d4ad',
    updatedAt: '10m ago',
    status: 'new',
    alert: false,
    crossedOut: false,
  },
  {
    id: '#T-8829',
    title: 'Billing cycle inquiry',
    description:
      'Customer wants to know why their bill was higher this month. Checked logs, seems to be data overage.',
    requester: 'Mark S.',
    avatarTone: '#b8a38f',
    updatedAt: '2h ago',
    status: 'in-progress',
    alert: false,
    crossedOut: false,
  },
  {
    id: '#T-8820',
    title: 'Server downtime alert',
    description:
      'Automated alert: US-East-1 region is experiencing high latency. Several customers impacted.',
    requester: 'System',
    avatarTone: '#7a3040',
    updatedAt: '4h ago',
    status: 'new',
    alert: true,
    crossedOut: false,
  },
  {
    id: '#T-8815',
    title: 'Password reset request',
    description:
      'User forgot password. Sent reset link via email. Confirmed message reached mailbox.',
    requester: 'Help Desk',
    avatarTone: '#4f6990',
    updatedAt: 'Yesterday',
    status: 'closed',
    alert: false,
    crossedOut: true,
  },
];

const mobileStatusLabel: Record<MobileStatus, string> = {
  new: 'New',
  'in-progress': 'In Progress',
  closed: 'Closed',
};

const mobileBottomNav: Array<{
  label: string;
  icon: 'home' | 'tickets' | 'notification' | 'profile';
  active: boolean;
}> = [
  { label: 'Home', icon: 'home', active: false },
  { label: 'Tickets', icon: 'tickets', active: true },
  { label: 'Alerts', icon: 'notification', active: false },
  { label: 'Profile', icon: 'profile', active: false },
];
</script>
