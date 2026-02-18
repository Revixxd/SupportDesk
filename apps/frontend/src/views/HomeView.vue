<template>
  <div v-if="!isMobile">
    <UiTicketManagement
      :tabs="tabs"
      :tickets="desktopTickets"
      :priority-label="priorityLabel"
      :footer-label="footerLabel"
      :current-page="meta.page"
      :total-pages="meta.totalPages"
      :loading="isListLoading"
      @change-page="changePage"
      @select-tab="setStatusByTab"
      @open-ticket="openTicket"
    />
    <p v-if="error" class="home-view__error">{{ error }}</p>
  </div>

  <div v-else>
    <UiMobileTicketQueue
      title="Ticket Queue"
      :date-label="todayLabel"
      :tabs="mobileTabs"
      :tickets="mobileTickets"
      :status-label="statusLabel"
      :bottom-nav="mobileBottomNav"
      :loading="isListLoading"
      :current-page="meta.page"
      :total-pages="meta.totalPages"
      :can-prev-page="canPrevPage"
      :can-next-page="canNextPage"
      @select-tab="setMobileStatusByTab"
      @prev-page="prevPage"
      @next-page="nextPage"
      @open-ticket="openTicket"
    />
    <p v-if="error" class="home-view__error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { useRouter } from 'vue-router';
import UiMobileTicketQueue from '@ui/UiMobileTicketQueue/UiMobileTicketQueue.vue';
import UiTicketManagement from '@ui/UiTicketManagement/UiTicketManagement.vue';
import { useTicketsStore } from '../composables/useTicketsStore';

const isMobile = useMediaQuery('(max-width: 920px)');
const router = useRouter();

const {
  tabs,
  desktopTickets,
  mobileTickets,
  footerLabel,
  meta,
  isListLoading,
  error,
  priorityLabel,
  statusLabel,
  mobileBottomNav,
  mobileTabs,
  canPrevPage,
  canNextPage,
  fetchTickets,
  setStatusByTab,
  setMobileStatusByTab,
  changePage,
  prevPage,
  nextPage,
} = useTicketsStore();

const todayLabel = computed(() => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());
});

onMounted(() => {
  void fetchTickets();
});

const openTicket = (ticketId: string) => {
  void router.push(`/ticket/${ticketId}`);
};
</script>

<style scoped lang="scss">
.home-view__error {
  margin: 0.75rem 1.4rem;
  color: var(--color-danger-text);
}
</style>
