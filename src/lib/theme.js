import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const stored = browser ? localStorage.getItem('theme') ?? 'dark' : 'dark';

export const theme = writable(stored);

theme.subscribe((value) => {
  if (!browser) return;
  localStorage.setItem('theme', value);
  document.documentElement.setAttribute('data-theme', value);
});
