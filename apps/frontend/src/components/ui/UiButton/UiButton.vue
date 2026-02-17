<template>
  <button class="ui-button" :class="[`ui-button--${variant}`, `ui-button--${size}`]" type="button">
    <span v-if="icon" class="ui-button__icon" aria-hidden="true">
      <UiIcon :name="icon" />
    </span>
    <span class="ui-button__label"><slot /></span>
  </button>
</template>

<script setup lang="ts">
import UiIcon from '@ui/UiIcon/UiIcon.vue';
import type { UiIconName } from '@ui/UiIcon/icon.types';

withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md';
    icon?: UiIconName;
  }>(),
  {
    variant: 'secondary',
    size: 'md',
    icon: undefined,
  },
);
</script>

<style scoped src="./UiButton.scss" lang="scss"></style>
