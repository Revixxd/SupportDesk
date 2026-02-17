<template>
  <span class="ui-badge" :class="`ui-badge--${variant}`"><slot /></span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "info" | "warning" | "success" | "danger" | "neutral";
  }>(),
  {
    variant: "neutral"
  }
);
</script>

<style scoped src="./UiBadge.scss" lang="scss"></style>
