<template>
  <main class="ui-ticket-management">
    <section class="ticket-panel">
      <div class="ticket-panel__filters">
        <div class="tabs">
          <UiTabPill
            v-for="tab in tabs"
            :key="tab.label"
            :label="tab.label"
            :count="tab.count ?? 0"
            :active="tab.active"
            @click="emit('select-tab', tab.label)"
          />
        </div>

        <!-- <div class="panel-buttons">
          <UiButton variant="secondary" size="sm" icon="filter">Filter</UiButton>
          <UiButton variant="secondary" size="sm" icon="export">Export</UiButton>
        </div> -->
      </div>

      <div class="ticket-table-wrap">
        <table class="ticket-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Subject</th>
              <th>Requester</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6">Loading tickets...</td>
            </tr>
            <tr v-else-if="tickets.length === 0">
              <td colspan="6">No tickets found.</td>
            </tr>
            <tr v-for="ticket in tickets" v-if="!loading && tickets.length > 0" :key="ticket.id">
              <td>
                <RouterLink :to="`/ticket/${ticket.id}`">{{ ticket.id }}</RouterLink>
              </td>
              <td>
                <strong>{{ ticket.subject }}</strong>
                <p>{{ ticket.description }}</p>
              </td>
              <td>
                <div class="requester">
                  <UiAvatar :name="ticket.requester" :tone="ticket.avatarTone" />
                  <div>
                    <strong>{{ ticket.requester }}</strong>
                    <p>{{ ticket.requesterRole }}</p>
                  </div>
                </div>
              </td>
              <td>
                <span class="priority" :class="`priority--${ticket.priority}`">{{
                  priorityLabel[ticket.priority]
                }}</span>
              </td>
              <td>
                <UiBadge :variant="ticket.statusVariant">{{ ticket.status }}</UiBadge>
              </td>
              <td>{{ ticket.updatedAt }}</td>
            </tr>
          </tbody>
        </table>

        <div class="ticket-table__footer">
          <p>{{ footerLabel }}</p>
          <div class="pagination">
            <button type="button" @click="emit('change-page', currentPage - 1)">&lt;</button>
            <button
              v-for="page in pageButtons"
              :key="page"
              type="button"
              :class="{ 'is-active': page === currentPage }"
              @click="emit('change-page', page)"
            >
              {{ page }}
            </button>
            <button type="button" @click="emit('change-page', currentPage + 1)">&gt;</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import UiAvatar from '@ui/UiAvatar/UiAvatar.vue';
import UiBadge from '@ui/UiBadge/UiBadge.vue';
import UiButton from '@ui/UiButton/UiButton.vue';
import UiTabPill from '@ui/UiTabPill/UiTabPill.vue';
import type { UiTicketManagementProps } from './UiTicketManagement.types';

const props = defineProps<UiTicketManagementProps>();

const emit = defineEmits<{
  (eventName: 'change-page', page: number): void;
  (eventName: 'select-tab', label: string): void;
}>();

const currentPage = computed(() => props.currentPage ?? 1);
const totalPages = computed(() => Math.max(1, props.totalPages ?? 1));
const maxButtons = 5;

const pageButtons = computed(() => {
  const page = currentPage.value;
  const pages = totalPages.value;

  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  const end = Math.min(pages, start + maxButtons - 1);
  start = Math.max(1, end - maxButtons + 1);

  const result: number[] = [];
  for (let value = start; value <= end; value += 1) {
    result.push(value);
  }

  return result;
});
</script>

<style scoped src="./UiTicketManagement.scss" lang="scss"></style>
