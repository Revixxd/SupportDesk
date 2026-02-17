<template>
  <div class="app-shell" data-theme="dark">
    <aside class="app-shell__sidebar">
      <Sidebar />
    </aside>
    <div class="app-shell__content">
      <div class="app-shell__topbar">
        <UiTicketTopBar
          title="Ticket Management"
          search-placeholder="Search by ID, subject or name."
          primary-action-label="New Ticket"
        />
      </div>
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import UiTicketTopBar from '@ui/UiTicketTopBar/UiTicketTopBar.vue';
import { RouterView } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';
</script>

<style scoped lang="scss" src="../styles/app.scss"></style>
