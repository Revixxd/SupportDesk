<template>
  <main class="ticket-detail" data-theme="dark">
    <header class="ticket-detail__header">
      <h1>Ticket {{ ticketId }}</h1>
    </header>

    <section class="ticket-detail__card"></section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const ticketId = computed(() => route.params.id);
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
}
</style>
