<template>
  <main class="ticket-detail" data-theme="dark">
    <header class="ticket-detail__header">
      <h1>Ticket {{ currentTicketView?.id ?? routeTicketId }}</h1>
      <p v-if="currentTicketView">Updated {{ currentTicketView.updatedAt }}</p>
    </header>

    <section class="ticket-detail__card">
      <p v-if="isDetailLoading">Loading ticket details...</p>
      <p v-else-if="error">{{ error }}</p>
      <template v-else-if="currentTicketView">
        <h2>{{ currentTicketView.subject }}</h2>
        <p>{{ currentTicketView.description }}</p>
        <div class="ticket-detail__meta-grid">
          <div>
            <span>Status</span>
            <strong>{{ currentTicketView.status }}</strong>
          </div>
          <div>
            <span>Priority</span>
            <strong>{{ currentTicketView.priority }}</strong>
          </div>
          <div>
            <span>Channel</span>
            <strong>{{ currentTicketView.channel }}</strong>
          </div>
          <div>
            <span>Created</span>
            <strong>{{ currentTicketView.createdAt }}</strong>
          </div>
          <div>
            <span>Requester</span>
            <strong>{{ currentTicketView.requesterName }}</strong>
            <p>{{ currentTicketView.requesterEmail }}</p>
          </div>
          <div>
            <span>Assignee</span>
            <strong>{{ currentTicketView.assigneeName }}</strong>
            <p>{{ currentTicketView.assigneeEmail }}</p>
          </div>
        </div>
      </template>
      <p v-else>Ticket not found.</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useTicketsStore } from '../../composables/useTicketsStore';

const route = useRoute();
const { fetchTicketById, currentTicketView, isDetailLoading, error } = useTicketsStore();

const routeTicketId = computed(() => {
  const value = route.params.id;

  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return typeof value === 'string' ? value : '';
});

const loadTicket = async () => {
  if (!routeTicketId.value) {
    return;
  }

  await fetchTicketById(routeTicketId.value);
};

onMounted(() => {
  void loadTicket();
});

watch(routeTicketId, () => {
  void loadTicket();
});
</script>

<style scoped lang="scss">
.ticket-detail {
  min-height: 100vh;
  padding: 1.4rem;
  color: var(--color-text-base);
  background: radial-gradient(120% 140% at 0% 0%, #11243f 0%, #051322 55%, #031023 100%);

  &__header {
    margin-bottom: 1rem;

    h1 {
      margin: 0;
      font-family: var(--font-display);
      font-size: 2rem;
      color: var(--color-text-strong);
    }

    p {
      margin: 0.45rem 0 0;
      color: var(--color-text-subtle);
    }
  }

  &__card {
    border: 1px solid var(--color-border-subtle);
    border-radius: 14px;
    background: linear-gradient(180deg, rgba(19, 42, 69, 0.9) 0%, rgba(16, 37, 63, 0.88) 100%);
    padding: 1rem;

    h2 {
      margin: 0;
      font-size: 1.15rem;
      color: var(--color-text-strong);
    }

    p {
      margin: 0.6rem 0 0;
      color: var(--color-text-muted);
      line-height: 1.45;
    }
  }

  &__meta-grid {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(2, minmax(180px, 1fr));
    gap: 1rem;

    span {
      display: block;
      color: var(--color-text-subtle);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    strong {
      display: block;
      margin-top: 0.2rem;
      color: var(--color-text-strong);
    }

    p {
      margin: 0.3rem 0 0;
      font-size: 0.9rem;
    }
  }
}
</style>
