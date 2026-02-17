<template>
  <span class="ui-avatar" :style="avatarStyle">
    <img v-if="src" :src="src" :alt="name" />
    <span v-else>{{ initials }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    name: string;
    src?: string;
    tone?: string;
  }>(),
  {
    src: '',
    tone: 'var(--avatar-fallback-bg)',
  },
);

const initials = computed(() =>
  props.name
    .split(' ')
    .map((chunk) => chunk[0])
    .join('')
    .slice(0, 2)
    .toUpperCase(),
);

const avatarStyle = computed(() => ({
  '--avatar-tone': props.tone,
}));
</script>

<style scoped src="./UiAvatar.scss" lang="scss"></style>
