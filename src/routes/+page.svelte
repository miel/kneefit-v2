<script>
  import { base } from '$app/paths';
  import ExerciseCard from '$lib/components/ExerciseCard.svelte';
  import { exerciseLogs, painAssessments } from '$lib/stores.js';
  import { todayISO } from '$lib/utils.js';

  const today = todayISO();

  $: todayLogs = $exerciseLogs.filter(l => l.date === today);
  $: todayPain = $painAssessments.filter(a => a.date === today);
  $: recentLogs = $exerciseLogs.slice(0, 3);

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  const dateLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
</script>

<div class="page">
  <div class="header">
    <p class="greeting">{greeting()}</p>
    <p class="date-label">{dateLabel}</p>
  </div>

  <div class="quick-actions">
    <a href="{base}/log-exercise" class="action-card exercise">
      <span class="action-icon">🏋️</span>
      <span class="action-label">Log Exercise</span>
    </a>
    <a href="{base}/log-pain" class="action-card pain">
      <span class="action-icon">📊</span>
      <span class="action-label">Log Pain</span>
    </a>
  </div>

  <section class="today-summary">
    <h2>Today</h2>
    {#if todayLogs.length === 0 && todayPain.length === 0}
      <p class="empty-today">Nothing logged today yet.</p>
    {:else}
      <div class="summary-chips">
        {#if todayLogs.length > 0}
          <div class="chip exercise-chip">{todayLogs.length} exercise {todayLogs.length === 1 ? 'session' : 'sessions'}</div>
        {/if}
        {#if todayPain.length > 0}
          <div class="chip pain-chip">{todayPain.length} pain {todayPain.length === 1 ? 'assessment' : 'assessments'}</div>
        {/if}
      </div>
    {/if}
  </section>

  {#if recentLogs.length > 0}
    <section class="recent">
      <h2>Recent Sessions</h2>
      {#each recentLogs as log (log.id)}
        <ExerciseCard {log} />
      {/each}
    </section>
  {/if}
</div>

<style>
  .page { padding-top: 0.5rem; }

  .header { margin-bottom: 1.5rem; }

  .greeting {
    font-size: 1.4rem;
    font-weight: 700;
  }

  .date-label {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin-top: 0.2rem;
  }

  .quick-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1.75rem;
  }

  .action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1.5rem 1rem;
    border-radius: var(--radius);
    text-decoration: none;
    transition: opacity 0.15s;
  }

  .action-card:active { opacity: 0.8; }

  .exercise { background: rgba(0,212,170,0.15); border: 1px solid rgba(0,212,170,0.25); }
  .pain     { background: rgba(149,117,205,0.15); border: 1px solid rgba(149,117,205,0.25); }

  .action-icon { font-size: 1.75rem; }

  .action-label {
    font-weight: 700;
    font-size: 0.875rem;
    color: var(--color-text);
  }

  h2 { margin-bottom: 0.75rem; }

  .empty-today {
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }

  .summary-chips {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .chip {
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.35rem 0.85rem;
    border-radius: 2rem;
  }

  .exercise-chip { background: rgba(0,212,170,0.2); color: var(--color-accent); }
  .pain-chip     { background: rgba(149,117,205,0.2); color: var(--color-evening); }

  .recent { margin-top: 1.75rem; }
  .today-summary { margin-bottom: 0.5rem; }
</style>
