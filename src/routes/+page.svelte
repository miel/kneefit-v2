<script>
  import { currentPage } from '$lib/navigation.js';
  import Home        from '$lib/pages/Home.svelte';
  import LogExercise from '$lib/pages/LogExercise.svelte';
  import LogPain     from '$lib/pages/LogPain.svelte';
  import History     from '$lib/pages/History.svelte';
  import Settings    from '$lib/pages/Settings.svelte';
</script>

{#if $currentPage === 'home'}
  <Home />
{:else if $currentPage === 'log-exercise'}
  <LogExercise />
{:else if $currentPage === 'log-pain'}
  <LogPain />
{:else if $currentPage === 'history'}
  <History />
{:else if $currentPage === 'settings'}
  <Settings />
{/if}
