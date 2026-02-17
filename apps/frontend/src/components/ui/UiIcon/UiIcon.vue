<template>
  <svg
    class="ui-icon"
    :class="`ui-icon--${name}`"
    :viewBox="viewBox"
    fill="currentColor"
    aria-hidden="true"
  >
    <path :d="path" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UiIconName } from './icon.types';

const props = defineProps<{
  name: UiIconName;
}>();

const viewBox = computed(() => iconMap[props.name].viewBox);
const path = computed(() => iconMap[props.name].path);

// TODO: In future, loading icons from external SVG files for better maintainability and scalability
const iconMap: Record<UiIconName, { viewBox: string; path: string }> = {
  'brand-supportdesk': {
    viewBox: '0 0 24 24',
    path: 'M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6zm5.25 4.5h1.5v3.75h3.75v1.5h-3.75v3.75h-1.5v-3.75H7.5v-1.5h3.75V7.5z',
  },
  home: {
    viewBox: '0 0 16 16',
    path: 'M8 2 1.5 7.2l1 1.2L4 7.2V14h3.6v-3h1V14H12V7.2l1.5 1.2 1-1.2z',
  },
  dashboard: {
    viewBox: '0 0 16 16',
    path: 'M1 1h6v6H1zM9 1h6v4H9zM9 7h6v8H9zM1 9h6v6H1z',
  },
  tickets: {
    viewBox: '0 0 16 16',
    path: 'M2 2h12v4a2 2 0 0 0 0 4v4H2v-4a2 2 0 0 0 0-4z',
  },
  agents: {
    viewBox: '0 0 16 16',
    path: 'M5.2 8A2.7 2.7 0 1 0 5.2 2.6 2.7 2.7 0 0 0 5.2 8zM12 7A2 2 0 1 0 12 3a2 2 0 0 0 0 4zM1 13.5A3.5 3.5 0 0 1 4.5 10h1.4A3.5 3.5 0 0 1 9.4 13.5V14H1zM9.1 14c0-2 1.4-3.4 3.2-3.4h.5c1.8 0 3.2 1.3 3.2 3.4z',
  },
  analytics: {
    viewBox: '0 0 16 16',
    path: 'M1 1h14v14H1zM3 11h2V6H3zm4 0h2V4H7zm4 0h2V8h-2z',
  },
  settings: {
    viewBox: '0 0 16 16',
    path: 'M9.6.8 10 2a6 6 0 0 1 1.5.9l1.2-.5 1.2 2-1 .9c.2.5.3 1 .3 1.6 0 .5-.1 1.1-.3 1.6l1 .9-1.2 2-1.2-.5c-.5.4-1 .6-1.5.9l-.4 1.2h-2.4L7 12.7c-.5-.3-1-.5-1.5-.9l-1.2.5-1.2-2 1-.9A5.7 5.7 0 0 1 4 7c0-.6.1-1.1.3-1.6l-1-.9 1.2-2 1.2.5c.5-.4 1-.6 1.5-.9L7.6.8zM8 10.3A2.3 2.3 0 1 0 8 5.7a2.3 2.3 0 0 0 0 4.6z',
  },
  help: {
    viewBox: '0 0 16 16',
    path: 'M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-2.2c.5 0 .9-.4.9-.9 0-.5-.4-.9-.9-.9-.5 0-.9.4-.9.9 0 .5.4.9.9.9zM6.8 6.4h1.3c0-.7.3-1.1 1-1.1.5 0 .9.3.9.8 0 .4-.2.6-.6.9l-.5.3c-.8.4-1.2.9-1.2 1.9v.3h1.3v-.2c0-.5.2-.8.8-1.1l.4-.2c.8-.5 1.2-1 1.2-1.9 0-1.3-1.1-2.2-2.5-2.2-1.6 0-2.5.9-2.6 2.5z',
  },
  search: {
    viewBox: '0 0 16 16',
    path: 'M6.5 2a4.5 4.5 0 1 0 2.847 7.985l3.334 3.334 1.06-1.06-3.334-3.334A4.5 4.5 0 0 0 6.5 2zm0 1.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
  },
  notification: {
    viewBox: '0 0 16 16',
    path: 'M8 1.6A3.2 3.2 0 0 0 4.8 4.8v2.6c0 .8-.2 1.5-.7 2.1L3 10.8h10l-1-1.3c-.5-.6-.7-1.3-.7-2.1V4.8A3.2 3.2 0 0 0 8 1.6zm0 12.8c1 0 1.8-.7 2-1.6H6c.2.9 1 1.6 2 1.6z',
  },
  profile: {
    viewBox: '0 0 16 16',
    path: 'M8 8.2A3.1 3.1 0 1 0 8 2a3.1 3.1 0 0 0 0 6.2zm0 1.5c-3.1 0-5.5 1.7-5.5 3.8V14h11v-.5c0-2.1-2.4-3.8-5.5-3.8z',
  },
  plus: {
    viewBox: '0 0 16 16',
    path: 'M7.25 3h1.5v4.25H13v1.5H8.75V13h-1.5V8.75H3v-1.5h4.25z',
  },
  filter: {
    viewBox: '0 0 16 16',
    path: 'M2.5 4h11v1.4h-11zm2 3h7v1.4h-7zm2 3h3v1.4h-3z',
  },
  export: {
    viewBox: '0 0 16 16',
    path: 'M8 2v7.3l2.3-2.3 1 1L8 11.4 4.8 8l1-1L7 9.3V2zM3 12h10v1.5H3z',
  },
};
</script>

<style scoped src="./UiIcon.scss" lang="scss"></style>
