<template>
  <aside class="ui-sidebar">
    <div class="ui-sidebar__brand">
      <span class="ui-sidebar__brand-mark" aria-hidden="true">
        <UiIcon name="brand-supportdesk" />
      </span>
      <strong>{{ brandName }}</strong>
    </div>

    <nav class="ui-sidebar__nav">
      <UiSidebarItem
        v-for="item in navItems"
        :key="item.label"
        :label="item.label"
        :icon="item.icon"
        :active="item.active"
        :count="item.count"
      />

      <p v-if="systemItems.length > 0" class="ui-sidebar__section-label">System</p>

      <UiSidebarItem
        v-if="systemItems.length > 0"
        v-for="item in systemItems"
        :key="item.label"
        :label="item.label"
        :icon="item.icon"
        :active="item.active"
        :count="item.count"
      />
    </nav>

    <footer class="ui-sidebar__footer">
      <UiAvatar :name="user.name" :tone="user.avatarTone" />
      <div>
        <strong>{{ user.name }}</strong>
        <p>{{ user.email }}</p>
      </div>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import UiAvatar from '@ui/UiAvatar/UiAvatar.vue';
import UiIcon from '@ui/UiIcon/UiIcon.vue';
import UiSidebarItem from '@ui/UiSidebarItem/UiSidebarItem.vue';
import type { UiIconName } from '@ui/UiIcon/icon.types';

type SidebarIcon = Extract<
  UiIconName,
  'dashboard' | 'tickets' | 'agents' | 'analytics' | 'settings' | 'help'
>;

defineProps<{
  brandName: string;
  navItems: Array<{ label: string; icon: SidebarIcon; active?: boolean; count?: number }>;
  systemItems: Array<{ label: string; icon: SidebarIcon; active?: boolean; count?: number }>;
  user: { name: string; email: string; avatarTone: string };
}>();
</script>

<style scoped src="./UiSidebar.scss" lang="scss"></style>
