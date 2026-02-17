<template>
  <main class="ui-ticket-management">
    <section class="ticket-panel">
      <div class="ticket-panel__filters">
        <div class="tabs">
          <UiTabPill
            v-for="tab in tabs"
            :key="tab.label"
            :label="tab.label"
            :count="tab.count"
            :active="tab.active"
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
            <tr v-for="ticket in tickets" :key="ticket.id">
              <td>
                <a href="#">{{ ticket.id }}</a>
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
                <UiBadge :variant="statusVariant[ticket.status]">{{ ticket.status }}</UiBadge>
              </td>
              <td>{{ ticket.updatedAt }}</td>
            </tr>
          </tbody>
        </table>

        <div class="ticket-table__footer">
          <p>{{ footerLabel }}</p>
          <div class="pagination">
            <button type="button">&#8249;</button>
            <button type="button" class="is-active">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">&#8250;</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import UiAvatar from '@ui/UiAvatar/UiAvatar.vue';
import UiBadge from '@ui/UiBadge/UiBadge.vue';
import UiButton from '@ui/UiButton/UiButton.vue';
import UiTabPill from '@ui/UiTabPill/UiTabPill.vue';

type Priority = 'high' | 'medium' | 'low';
type Status = 'Open' | 'Pending' | 'Resolved';

defineProps<{
  tabs: Array<{ label: string; count: number; active?: boolean }>;
  tickets: Array<{
    id: string;
    subject: string;
    description: string;
    requester: string;
    requesterRole: string;
    priority: Priority;
    status: Status;
    updatedAt: string;
    avatarTone: string;
  }>;
  statusVariant: Record<Status, 'info' | 'warning' | 'success'>;
  priorityLabel: Record<Priority, string>;
  footerLabel: string;
}>();
</script>

<style scoped src="./UiTicketManagement.scss" lang="scss"></style>
