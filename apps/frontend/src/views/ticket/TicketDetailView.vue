<template>
  <main class="ticket-detail" data-theme="dark">
    <header class="ticket-detail__topbar">
      <RouterLink class="ticket-detail__back" :to="{ name: 'ticket-management' }">
        Powrót do listy
      </RouterLink>
      <span class="ticket-detail__id">{{ currentTicketView?.id ?? routeTicketId }}</span>
    </header>

    <section class="ticket-detail__layout">
      <p v-if="isDetailLoading">Loading ticket details...</p>
      <p v-else-if="error">{{ error }}</p>
      <template v-else-if="currentTicketView">
        <article class="ticket-detail__card">
          <h1>{{ currentTicketView.subject }}</h1>
          <p class="ticket-detail__description">{{ currentTicketView.description }}</p>

          <div class="ticket-detail__meta-grid">
            <div class="ticket-detail__meta-item">
              <span>ID</span>
              <strong>{{ currentTicketView.id }}</strong>
            </div>
            <div class="ticket-detail__meta-item">
              <span>Klient</span>
              <strong>{{ currentTicketView.requesterName }}</strong>
              <small>{{ currentTicketView.requesterEmail }}</small>
            </div>
            <div class="ticket-detail__meta-item">
              <span>Status</span>
              <strong>{{ currentTicketView.status }}</strong>
            </div>
            <div class="ticket-detail__meta-item">
              <span>Priorytet</span>
              <strong>{{ currentTicketView.priority }}</strong>
            </div>
            <div class="ticket-detail__meta-item">
              <span>Data utworzenia</span>
              <strong>{{ currentTicketView.createdAt }}</strong>
            </div>
          </div>
        </article>

        <aside class="ticket-detail__status-panel">
          <h2>Zmień status</h2>
          <p class="ticket-detail__status-current">
            Aktualny status: <strong>{{ currentTicketView.status }}</strong>
          </p>

          <label class="ticket-detail__label" for="ticket-status-select">Nowy status</label>
          <select id="ticket-status-select" v-model="selectedStatus" class="ticket-detail__select">
            <option v-for="status in statusOptions" :key="status" :value="status">
              {{ statusToLabel[status] }}
            </option>
          </select>

          <button
            class="ticket-detail__save"
            type="button"
            :disabled="isSaving || !canSaveStatus"
            @click="saveStatus"
          >
            {{ isSaving ? 'Zapisywanie...' : 'Zapisz' }}
          </button>

          <p v-if="saveSuccess" class="ticket-detail__save-success">Status zapisany.</p>
          <p v-if="saveError" class="ticket-detail__save-error">{{ saveError }}</p>
        </aside>
      </template>
      <p v-else class="ticket-detail__empty">Ticket not found.</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useTicketsStore } from '../../composables/useTicketsStore';
import type { TicketStatus } from '../../types/tickets';

const route = useRoute();
const { fetchTicketById, updateTicketStatus, currentTicketView, isDetailLoading, error } =
  useTicketsStore();

const statusOptions: TicketStatus[] = ['NEW', 'OPEN', 'PENDING', 'RESOLVED', 'CLOSED'];

const statusToLabel: Record<TicketStatus, string> = {
  NEW: 'New',
  OPEN: 'Open',
  PENDING: 'Pending',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

const selectedStatus = ref<TicketStatus>('NEW');
const isSaving = ref(false);
const saveSuccess = ref(false);
const saveError = ref('');

const routeTicketId = computed(() => {
  const value = route.params.id;

  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return typeof value === 'string' ? value : '';
});

const canSaveStatus = computed(() => {
  return currentTicketView.value?.statusValue !== selectedStatus.value;
});

const loadTicket = async () => {
  if (!routeTicketId.value) {
    return;
  }

  saveSuccess.value = false;
  saveError.value = '';
  await fetchTicketById(routeTicketId.value);
};

const saveStatus = async () => {
  if (!routeTicketId.value || !canSaveStatus.value) {
    return;
  }

  isSaving.value = true;
  saveSuccess.value = false;
  saveError.value = '';

  const result = await updateTicketStatus(routeTicketId.value, selectedStatus.value);

  if (!result) {
    saveError.value = error.value ?? 'Nie udało się zapisać statusu.';
    isSaving.value = false;
    return;
  }

  saveSuccess.value = true;
  isSaving.value = false;
};

watch(
  () => currentTicketView.value?.statusValue,
  (nextStatus) => {
    if (nextStatus) {
      selectedStatus.value = nextStatus;
    }
  },
  { immediate: true },
);

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
  padding: 1.25rem;
  color: #e8edf8;
  background:
    radial-gradient(130% 120% at 0% 0%, #203352 0%, #111d32 45%, #0b1425 100%),
    linear-gradient(180deg, #0a1222 0%, #0d1628 100%);

  &__topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    padding: 0.55rem 0.85rem;
    border-radius: 10px;
    border: 1px solid #394868;
    color: #d9e3f8;
    text-decoration: none;
    font-weight: 600;
    background: rgba(21, 31, 50, 0.75);
  }

  &__id {
    padding: 0.35rem 0.6rem;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.82rem;
    background: rgba(47, 98, 196, 0.24);
    color: #95beff;
  }

  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
    gap: 1rem;
  }

  &__card,
  &__status-panel {
    border-radius: 14px;
    border: 1px solid #344463;
    background: linear-gradient(180deg, rgba(19, 31, 50, 0.9) 0%, rgba(16, 27, 45, 0.92) 100%);
    box-shadow: 0 16px 30px rgba(0, 0, 0, 0.22);
    padding: 1.1rem;
  }

  &__card h1 {
    margin: 0;
    font-size: 1.55rem;
    line-height: 1.2;
    color: #f2f6ff;
  }

  &__description {
    margin-top: 0.85rem;
    color: #c4d0e7;
    line-height: 1.55;
  }

  &__meta-grid {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(2, minmax(170px, 1fr));
    gap: 0.85rem;
  }

  &__meta-item {
    padding: 0.75rem;
    border-radius: 10px;
    background: rgba(28, 41, 67, 0.52);
    border: 1px solid rgba(82, 105, 146, 0.4);

    span {
      display: block;
      font-size: 0.74rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #8ea4c8;
      margin-bottom: 0.3rem;
    }

    strong {
      color: #f2f6ff;
      font-size: 0.95rem;
    }

    small {
      display: block;
      margin-top: 0.3rem;
      color: #a8bad7;
    }
  }

  &__status-panel h2 {
    margin: 0 0 0.9rem;
    font-size: 1.1rem;
    color: #f2f6ff;
  }

  &__status-current {
    margin: 0 0 0.8rem;
    color: #b7c6df;
  }

  &__label {
    display: block;
    margin-bottom: 0.4rem;
    color: #a8bad7;
    font-size: 0.82rem;
  }

  &__select {
    width: 100%;
    border-radius: 10px;
    border: 1px solid #3b4f75;
    background: #121d32;
    color: #e8edf8;
    padding: 0.68rem 0.7rem;
  }

  &__save {
    margin-top: 0.8rem;
    width: 100%;
    border: 0;
    border-radius: 10px;
    padding: 0.7rem;
    font-weight: 700;
    color: #f8fbff;
    background: linear-gradient(180deg, #2b7df6 0%, #1f5fb8 100%);
    cursor: pointer;

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }

  &__save-success {
    margin: 0.7rem 0 0;
    color: #66d7aa;
    font-size: 0.85rem;
  }

  &__save-error {
    margin: 0.7rem 0 0;
    color: #ff8f8f;
    font-size: 0.85rem;
  }

  &__empty {
    grid-column: 1 / -1;
  }
}

@media (max-width: 900px) {
  .ticket-detail {
    &__layout {
      grid-template-columns: 1fr;
    }

    &__meta-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
