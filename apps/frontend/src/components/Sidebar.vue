<template>
  <UiSidebar
    brand-name="SupportDesk"
    :nav-items="navItems"
    :system-items="systemItems"
    :user="user"
  />
</template>

<script setup lang="ts">
import UiSidebar from '@ui/UiSidebar/UiSidebar.vue';
import type { UiIconName } from '@ui/UiIcon/icon.types';

type SidebarItem = {
  label: string;
  icon: Extract<UiIconName, 'dashboard' | 'tickets' | 'agents' | 'analytics' | 'settings' | 'help'>;
  count?: number;
  active?: boolean;
};

const navItems: SidebarItem[] = [
  { label: 'Tickets', icon: 'tickets' as const, count: 12, active: true },
];

const systemItems: SidebarItem[] = [];

const user = {
  name: 'Mock User',
  email: 'mock@support.com',
  avatarTone: '#f0d8be',
};
</script>
