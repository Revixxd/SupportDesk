<template>
  <section class="ui-mobile-queue">
    <header class="ui-mobile-queue__header">
      <div>
        <h1>{{ title }}</h1>
        <p>{{ dateLabel }}</p>
      </div>
      <!-- <button type="button" class="ui-mobile-queue__search" aria-label="Search">
        <UiIcon name="search" />
      </button> -->
    </header>

    <div class="ui-mobile-queue__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.label"
        type="button"
        class="queue-tab"
        :class="{ 'is-active': tab.active }"
        @click="emit('select-tab', tab.label)"
      >
        <span>{{ tab.label }}</span>
        <span v-if="tab.count" class="queue-tab__count">{{ tab.count }}</span>
      </button>
    </div>

    <div class="ui-mobile-queue__list">
      <p v-if="loading" class="ui-mobile-queue__state">Loading tickets...</p>
      <p v-else-if="tickets.length === 0" class="ui-mobile-queue__state">No tickets found.</p>
      <article
        v-for="ticket in tickets"
        v-if="!loading && tickets.length > 0"
        :key="ticket.id"
        class="queue-card"
        :class="{ 'is-alert': ticket.alert, 'is-muted': ticket.crossedOut }"
      >
        <div class="queue-card__meta">
          <p>
            {{ ticket.id }}
            <span v-if="ticket.alert" class="queue-card__dot" aria-hidden="true"></span>
          </p>
          <span>{{ ticket.updatedAt }}</span>
        </div>

        <h3>{{ ticket.title }}</h3>
        <p class="queue-card__description">{{ ticket.description }}</p>

        <div class="queue-card__footer">
          <div class="queue-card__author">
            <UiAvatar :name="ticket.requester" :tone="ticket.avatarTone" />
            <strong>{{ ticket.requester }}</strong>
          </div>

          <span class="queue-status" :class="`queue-status--${ticket.status}`">{{
            statusLabel[ticket.status]
          }}</span>
        </div>
      </article>
    </div>
    <div class="ui-mobile-queue__pagination">
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <div class="ui-mobile-queue__pagination-actions">
        <button
          v-if="canPrevPage"
          type="button"
          :disabled="loading"
          @click="emit('prev-page')"
        >
          Prev
        </button>
        <button type="button" :disabled="!canNextPage || loading" @click="emit('next-page')">
          Next
        </button>
      </div>
    </div>

    <button class="ui-mobile-queue__fab" type="button" aria-label="Create ticket">
      <UiIcon name="plus" />
    </button>

    <nav class="ui-mobile-queue__bottom-nav" aria-label="Mobile navigation">
      <button
        v-for="item in bottomNav"
        :key="item.label"
        type="button"
        class="bottom-nav-item"
        :class="{ 'is-active': item.active }"
      >
        <UiIcon :name="item.icon" />
        <span>{{ item.label }}</span>
      </button>
    </nav>
  </section>
</template>

<script setup lang="ts">
import UiAvatar from '@ui/UiAvatar/UiAvatar.vue';
import UiIcon from '@ui/UiIcon/UiIcon.vue';
import type { UiIconName } from '@ui/UiIcon/icon.types';

type MobileStatus = 'new' | 'in-progress' | 'closed';

defineProps<{
  title: string;
  dateLabel: string;
  tabs: Array<{ label: string; active?: boolean; count?: number }>;
  tickets: Array<{
    id: string;
    title: string;
    description: string;
    requester: string;
    avatarTone: string;
    updatedAt: string;
    status: MobileStatus;
    alert?: boolean;
    crossedOut?: boolean;
  }>;
  statusLabel: Record<MobileStatus, string>;
  bottomNav: Array<{
    label: string;
    icon: Extract<UiIconName, 'home' | 'tickets' | 'notification' | 'profile'>;
    active?: boolean;
  }>;
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  canPrevPage?: boolean;
  canNextPage?: boolean;
}>();

const emit = defineEmits<{
  (eventName: 'select-tab', label: string): void;
  (eventName: 'prev-page'): void;
  (eventName: 'next-page'): void;
}>();
</script>

<style scoped src="./UiMobileTicketQueue.scss" lang="scss"></style>
