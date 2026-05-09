<script>
  import ExerciseCard from '$lib/components/ExerciseCard.svelte';
  import PainCard from '$lib/components/PainCard.svelte';
  import ActivityGrid from '$lib/components/ActivityGrid.svelte';
  import { exerciseLogs, painAssessments, importLogs, showToast } from '$lib/stores.js';
  import { exportToCSV, parseV1CSV } from '$lib/csv.js';

  let activeTab = 'exercises';
  let fileInput;
  let importPreview = null;

  function handleExport() {
    exportToCSV($exerciseLogs, $painAssessments);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = parseV1CSV(ev.target.result);
      importPreview = result;
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  async function confirmImport() {
    if (!importPreview) return;
    await importLogs(importPreview.logs, importPreview.assessments);
    showToast(`Imported ${importPreview.logs.length} sessions, ${importPreview.assessments.length} assessments`);
    importPreview = null;
  }
</script>

<div class="page">
  <h1>History</h1>

  <div class="tabs">
    <button class:active={activeTab === 'exercises'} on:click={() => activeTab = 'exercises'} type="button">
      Exercises
    </button>
    <button class:active={activeTab === 'pain'} on:click={() => activeTab = 'pain'} type="button">
      Pain
    </button>
  </div>

  {#if activeTab === 'exercises'}
    <ActivityGrid logs={$exerciseLogs} mode="exercise" />
    {#if $exerciseLogs.length === 0}
      <p class="empty">No exercise sessions logged yet.</p>
    {:else}
      {#each $exerciseLogs as log (log.id)}
        <ExerciseCard {log} />
      {/each}
    {/if}
  {:else}
    <ActivityGrid logs={$painAssessments} mode="pain" />
    {#if $painAssessments.length === 0}
      <p class="empty">No pain assessments logged yet.</p>
    {:else}
      {#each $painAssessments as assessment (assessment.id)}
        <PainCard {assessment} />
      {/each}
    {/if}
  {/if}

  <div class="data-actions">
    <button class="action-btn" on:click={handleExport} type="button">Export CSV</button>
    <button class="action-btn" on:click={() => fileInput.click()} type="button">Import from v1</button>
    <input type="file" accept=".csv" bind:this={fileInput} on:change={handleFileChange} style="display:none" />
  </div>

  {#if importPreview}
    <div class="import-preview">
      <p>
        Found <strong>{importPreview.logs.length}</strong> exercise sessions and
        <strong>{importPreview.assessments.length}</strong> pain assessments.
        {#if importPreview.errors.length > 0}
          <span class="warn">({importPreview.errors.length} rows skipped)</span>
        {/if}
      </p>
      <div class="import-actions">
        <button class="action-btn" on:click={confirmImport} type="button">Import</button>
        <button class="action-btn secondary" on:click={() => importPreview = null} type="button">Cancel</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .page { padding-top: 0.5rem; }
  h1 { margin-bottom: 1.25rem; }

  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .tabs button {
    flex: 1;
    padding: 0.6rem;
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    color: var(--color-text-muted);
    font-weight: 600;
    font-size: 0.875rem;
    transition: background 0.15s, color 0.15s;
  }

  .tabs button.active {
    background: var(--color-accent);
    color: #0d1b2a;
  }

  .empty {
    color: var(--color-text-muted);
    text-align: center;
    padding: 3rem 0;
    font-size: 0.95rem;
  }

  .data-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .action-btn {
    flex: 1;
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    background: var(--color-surface-2);
    color: var(--color-text-muted);
    font-weight: 600;
    font-size: 0.875rem;
  }

  .import-preview {
    margin-top: 1rem;
    background: var(--color-surface);
    border-radius: var(--radius);
    padding: 1rem;
    border: 1px solid rgba(0,212,170,0.3);
  }

  .import-preview p {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }

  .import-actions {
    display: flex;
    gap: 0.5rem;
  }

  .warn { color: var(--color-morning); }
</style>
