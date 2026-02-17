<template>
  <button class="ui-tab-pill" :class="{ 'is-active': active }" type="button">
    <span>{{ label }}</span>
    <span class="ui-tab-pill__count">{{ count }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  count: number;
  active?: boolean;
}>();
</script>

<style scoped src="./UiTabPill.scss" lang="scss"></style>
