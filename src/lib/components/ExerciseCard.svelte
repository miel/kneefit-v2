<script>
  import TimeSlotBadge from './TimeSlotBadge.svelte';
  import ConfirmDialog from './ConfirmDialog.svelte';
  import ExerciseSelect from './ExerciseSelect.svelte';
  import { formatDate } from '$lib/utils.js';
  import { removeLog, editLog, showToast } from '$lib/stores.js';
  import { TIME_SLOTS } from '$lib/constants.js';

  export let log;
  let expanded = false;
  let editing = false;
  let confirmOpen = false;

  let draft;

  function startEdit() {
    draft = {
      ...log,
      exercises: log.exercises.map(ex => ({ ...ex }))
    };
    editing = true;
  }

  function cancelEdit() {
    editing = false;
    draft = null;
  }

  async function saveEdit() {
    await editLog(draft);
    log = draft;
    editing = false;
    draft = null;
    showToast('Session updated');
  }

  async function handleDelete() {
    confirmOpen = false;
    await removeLog(log.id);
    showToast('Session deleted');
  }

  $: first = log.exercises[0];
</script>

<article class="card" class:expanded>
  <button class="summary" on:click={() => { if (!editing) expanded = !expanded; }} type="button">
    <div class="top-row">
      <TimeSlotBadge slot={log.timeSlot} />
      <span class="chevron">{expanded ? '▲' : '▼'}</span>
    </div>
    <div class="exercise-name">{first?.exercise ?? '—'}</div>
    <div class="stats-row">
      <span class="date">{formatDate(log.date)}</span>
      {#if first}
        <span class="stat">{first.sets} × {first.reps} @ {first.weight} kg</span>
      {/if}
    </div>
  </button>

  {#if expanded}
    <div class="details">
      {#if editing}
        <div class="edit-form">
          <div class="field-row">
            <div class="field">
              <label for="edit-date-{log.id}">Date</label>
              <input id="edit-date-{log.id}" type="date" bind:value={draft.date} />
            </div>
            <div class="field">
              <label for="edit-slot-{log.id}">Time</label>
              <select id="edit-slot-{log.id}" bind:value={draft.timeSlot}>
                {#each TIME_SLOTS as ts}
                  <option value={ts.value}>{ts.label}</option>
                {/each}
              </select>
            </div>
          </div>

          {#each draft.exercises as ex, i}
            {#if i > 0}<div class="divider"></div>{/if}
            <div class="field">
              <label>Exercise {draft.exercises.length > 1 ? i + 1 : ''}</label>
              <ExerciseSelect bind:value={ex.exercise} />
            </div>
            <div class="field-row four">
              <div class="field">
                <label for="edit-sets-{log.id}-{i}">Sets</label>
                <input id="edit-sets-{log.id}-{i}" type="number" bind:value={ex.sets} min="1" />
              </div>
              <div class="field">
                <label for="edit-reps-{log.id}-{i}">Reps</label>
                <input id="edit-reps-{log.id}-{i}" type="number" bind:value={ex.reps} min="1" />
              </div>
              <div class="field">
                <label for="edit-weight-{log.id}-{i}">kg</label>
                <input id="edit-weight-{log.id}-{i}" type="number" bind:value={ex.weight} min="0" step="0.5" />
              </div>
              <div class="field">
                <label for="edit-rest-{log.id}-{i}">Rest (s)</label>
                <input id="edit-rest-{log.id}-{i}" type="number" bind:value={ex.restTime} min="0" />
              </div>
            </div>
          {/each}

          <div class="field">
            <label for="edit-notes-{log.id}">Notes</label>
            <textarea id="edit-notes-{log.id}" bind:value={draft.notes} rows="2"></textarea>
          </div>

          <div class="action-row">
            <button class="save-btn" on:click={saveEdit} type="button">Save</button>
            <button class="cancel-btn" on:click={cancelEdit} type="button">Cancel</button>
          </div>
        </div>
      {:else}
        {#each log.exercises as ex, i}
          {#if i > 0}
            <div class="divider"></div>
            <div class="exercise-name secondary">{ex.exercise}</div>
          {/if}
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">Sets</span><span>{ex.sets}</span></div>
            <div class="detail-item"><span class="detail-label">Reps</span><span>{ex.reps}</span></div>
            <div class="detail-item"><span class="detail-label">Weight</span><span>{ex.weight} kg</span></div>
            <div class="detail-item"><span class="detail-label">Rest</span><span>{ex.restTime}s</span></div>
          </div>
        {/each}
        {#if log.notes}
          <p class="notes">{log.notes}</p>
        {/if}
        <div class="action-row">
          <button class="edit-btn" on:click={startEdit} type="button">Edit session</button>
          <button class="delete-btn" on:click={() => confirmOpen = true} type="button">Delete session</button>
        </div>
      {/if}
    </div>
  {/if}
</article>

<ConfirmDialog
  bind:open={confirmOpen}
  message="Delete this exercise session? This cannot be undone."
  on:confirm={handleDelete}
  on:cancel={() => confirmOpen = false}
/>

<style>
  .card {
    background: var(--color-surface);
    border-radius: var(--radius);
    margin-bottom: 0.75rem;
    overflow: hidden;
    border: 1px solid rgba(128,128,128,0.1);
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

  .exercise-name {
    font-weight: 600;
    font-size: 1rem;
  }

  .exercise-name.secondary {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    margin-top: 0.25rem;
  }

  .stats-row {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .date {
    font-size: 0.8rem;
    color: var(--color-text-muted);
  }

  .stat {
    font-size: 0.875rem;
    color: var(--color-accent);
    font-weight: 600;
  }

  .details {
    padding: 0 1rem 1rem;
    border-top: 1px solid rgba(128,128,128,0.1);
  }

  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .detail-item {
    background: var(--color-surface-2);
    border-radius: var(--radius-sm);
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
  }

  .detail-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
  }

  .divider {
    height: 1px;
    background: rgba(128,128,128,0.1);
    margin: 0.75rem 0 0;
  }

  .notes {
    font-size: 0.85rem;
    color: var(--color-text-muted);
    margin-top: 0.75rem;
    font-style: italic;
  }

  .action-row {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .edit-btn {
    flex: 1;
    padding: 0.6rem;
    border-radius: var(--radius-sm);
    background: rgba(0,212,170,0.12);
    color: var(--color-accent);
    font-weight: 600;
    font-size: 0.875rem;
  }

  .delete-btn {
    flex: 1;
    padding: 0.6rem;
    border-radius: var(--radius-sm);
    background: rgba(255,107,107,0.12);
    color: var(--color-danger);
    font-weight: 600;
    font-size: 0.875rem;
  }

  /* Edit form */
  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-top: 0.75rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .field label {
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .field-row.four {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  .save-btn {
    flex: 1;
    padding: 0.6rem;
    border-radius: var(--radius-sm);
    background: var(--color-accent);
    color: #0d1b2a;
    font-weight: 700;
    font-size: 0.875rem;
  }

  .cancel-btn {
    flex: 1;
    padding: 0.6rem;
    border-radius: var(--radius-sm);
    background: var(--color-surface-2);
    color: var(--color-text-muted);
    font-weight: 600;
    font-size: 0.875rem;
  }
</style>
