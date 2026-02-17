<template>
  <header class="ui-ticket-top-bar">
    <h1>{{ title }}</h1>

    <div class="ui-ticket-top-bar__actions">
      <!-- <label class="search" aria-label="Search">
        <UiIcon name="search" />
        <input type="text" :placeholder="searchPlaceholder" />
      </label> -->

      <!-- <button class="icon-dot" type="button" aria-label="Notifications">
        <UiIcon name="notification" />
      </button> -->

      <UiButton variant="primary" icon="plus">{{ primaryActionLabel }}</UiButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import UiButton from '@ui/UiButton/UiButton.vue';
import UiIcon from '@ui/UiIcon/UiIcon.vue';

defineProps<{
  title: string;
  searchPlaceholder: string;
  primaryActionLabel: string;
}>();
</script>

<style scoped src="./UiTicketTopBar.scss" lang="scss"></style>
