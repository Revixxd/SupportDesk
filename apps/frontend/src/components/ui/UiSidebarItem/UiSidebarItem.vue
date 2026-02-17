<template>
  <button
    class="ui-sidebar-item"
    :class="{ 'is-active': active }"
    type="button"
    :aria-label="label"
  >
    <span class="ui-sidebar-item__icon" aria-hidden="true">
      <UiIcon :name="icon" />
    </span>
    <span class="ui-sidebar-item__label">{{ label }}</span>
    <span v-if="count !== undefined" class="ui-sidebar-item__count">{{ count }}</span>
  </button>
</template>

<script setup lang="ts">
import UiIcon from '@ui/UiIcon/UiIcon.vue';
import type { UiIconName } from '@ui/UiIcon/icon.types';

defineProps<{
  label: string;
  icon: UiIconName;
  active?: boolean;
  count?: number;
}>();
</script>

<style scoped src="./UiSidebarItem.scss" lang="scss"></style>
