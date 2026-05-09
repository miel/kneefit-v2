<script>
  import TimeSlotBadge from './TimeSlotBadge.svelte';
  import ConfirmDialog from './ConfirmDialog.svelte';
  import { formatDate, painDisplay, painColor } from '$lib/utils.js';
  import { removePain, showToast } from '$lib/stores.js';

  export let assessment;
  let expanded = false;
  let confirmOpen = false;

  const { restPain, activityPain, touchPain, scaleType } = assessment;
  const worstColor = (() => {
    if (scaleType === 'numeric') {
      return painColor(Math.max(Number(restPain), Number(activityPain), Number(touchPain)), 'numeric');
    }
    const order = ['no pain', 'sensitive', 'painful', 'sharp pain'];
    const worst = [restPain, activityPain, touchPain].sort((a, b) => order.indexOf(b) - order.indexOf(a))[0];
    return painColor(worst, 'qualitative');
  })();

  async function handleDelete() {
    confirmOpen = false;
    await removePain(assessment.id);
    showToast('Assessment deleted');
  }
</script>

<article class="card">
  <button class="summary" on:click={() => expanded = !expanded} type="button">
    <div class="top-row">
      <TimeSlotBadge slot={assessment.timeSlot} />
      <span class="chevron">{expanded ? '▲' : '▼'}</span>
    </div>
    <div class="stats-row">
      <span class="date">{formatDate(assessment.date)}</span>
      <span class="worst-dot" style="background: {worstColor}"></span>
      <span class="worst-label" style="color: {worstColor}">
        {painDisplay(restPain, scaleType)} · {painDisplay(activityPain, scaleType)} · {painDisplay(touchPain, scaleType)}
      </span>
    </div>
  </button>

  {#if expanded}
    <div class="details">
      {#each [
        { label: 'At rest', value: restPain },
        { label: 'During activity', value: activityPain },
        { label: 'When touched', value: touchPain }
      ] as item}
        <div class="pain-row">
          <span class="pain-label">{item.label}</span>
          <span class="pain-value" style="color: {painColor(item.value, scaleType)}">
            {painDisplay(item.value, scaleType)}
          </span>
        </div>
      {/each}
      <div class="scale-chip">{scaleType}</div>
      {#if assessment.notes}
        <p class="notes">{assessment.notes}</p>
      {/if}
      <button class="delete-btn" on:click={() => confirmOpen = true} type="button">Delete assessment</button>
    </div>
  {/if}
</article>

<ConfirmDialog
  bind:open={confirmOpen}
  message="Delete this pain assessment? This cannot be undone."
  on:confirm={handleDelete}
  on:cancel={() => confirmOpen = false}
/>

<style>
  .card {
    background: var(--color-surface);
    border-radius: var(--radius);
    margin-bottom: 0.75rem;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.06);
  }

  .summary {
    width: 100%;
    text-align: left;
    background: none;
    color: inherit;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chevron {
    color: var(--color-text-muted);
    font-size: 0.7rem;
  }

  .stats-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .date {
    font-size: 0.8rem;
    color: var(--color-text-muted);
  }

  .worst-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .worst-label {
    font-size: 0.875rem;
    font-weight: 600;
  }

  .details {
    padding: 0 1rem 1rem;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .pain-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  .pain-label {
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .pain-value {
    font-weight: 700;
    font-size: 0.95rem;
  }

  .scale-chip {
    display: inline-block;
    margin-top: 0.75rem;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.2rem 0.6rem;
    border-radius: 2rem;
    background: var(--color-surface-2);
    color: var(--color-text-muted);
  }

  .notes {
    font-size: 0.85rem;
    color: var(--color-text-muted);
    margin-top: 0.75rem;
    font-style: italic;
  }

  .delete-btn {
    margin-top: 1rem;
    width: 100%;
    padding: 0.6rem;
    border-radius: var(--radius-sm);
    background: rgba(255,107,107,0.15);
    color: var(--color-danger);
    font-weight: 600;
    font-size: 0.875rem;
  }
</style>
