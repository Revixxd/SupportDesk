import type { Ticket } from '../types/tickets';

const AVATAR_TONES = ['#f7d8b2', '#8b5cf6', '#22a9d9', '#e11d8f', '#8a6f56', '#4f6990'];

const hashString = (value: string): number => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

export const getAvatarTone = (seed: string): string => {
  return AVATAR_TONES[hashString(seed) % AVATAR_TONES.length];
};

export const getRequesterName = (ticket: Ticket): string => {
  return ticket.requester.name ?? ticket.requester.email;
};

export const formatRelativeTime = (dateValue: string): string => {
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  const diffMilliseconds = parsedDate.getTime() - Date.now();
  const diffSeconds = Math.round(diffMilliseconds / 1000);
  const absoluteSeconds = Math.abs(diffSeconds);

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (absoluteSeconds < 60) {
    return formatter.format(diffSeconds, 'second');
  }

  const diffMinutes = Math.round(diffSeconds / 60);
  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, 'minute');
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, 'hour');
  }

  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, 'day');
};

export const formatDateTime = (dateValue: string): string => {
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate);
};
