<script>
  import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
  import { customExercises, addCustomExercise, removeCustomExercise, showToast } from '$lib/stores.js';
  import { BUILTIN_EXERCISES } from '$lib/constants.js';
  import { theme } from '$lib/theme.js';

  function toggleTheme() {
    theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  const version = __APP_VERSION__;

  let newName = '';
  let confirmTarget = null;

  async function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    const lower = name.toLowerCase();
    if ([...BUILTIN_EXERCISES, ...$customExercises].some(e => e.toLowerCase() === lower)) {
      showToast('Exercise already exists', 'error');
      return;
    }
    await addCustomExercise(name);
    newName = '';
    showToast(`"${name}" added`);
  }

  async function handleDelete(name) {
    confirmTarget = null;
    await removeCustomExercise(name);
    showToast(`"${name}" removed`);
  }

  function keydown(e) {
    if (e.key === 'Enter') handleAdd();
  }
</script>

<div class="page">
  <h1>Settings</h1>

  <section>
    <h2>Appearance</h2>
    <div class="setting-row">
      <span class="setting-label">Theme</span>
      <button class="theme-toggle" on:click={toggleTheme} type="button">
        {#if $theme === 'dark'}
          <span class="theme-icon">☀️</span> Light mode
        {:else}
          <span class="theme-icon">🌙</span> Dark mode
        {/if}
      </button>
    </div>
  </section>

  <section>
    <h2>My Exercises</h2>
    <p class="hint">Add custom exercises to the logging dropdown.</p>

    <div class="add-row">
      <input
        type="text"
        bind:value={newName}
        placeholder="e.g. Hip Thrust"
        on:keydown={keydown}
        maxlength="60"
      />
      <button class="add-btn" on:click={handleAdd} type="button">Add</button>
    </div>

    {#if $customExercises.length === 0}
      <p class="empty">No custom exercises yet.</p>
    {:else}
      <ul class="exercise-list">
        {#each $customExercises as name}
          <li>
            <span>{name}</span>
            <button class="delete-btn" on:click={() => confirmTarget = name} type="button">✕</button>
          </li>
        {/each}
      </ul>
    {/if}
  </section>

  <section class="builtin-section">
    <h2>Built-in Exercises</h2>
    <ul class="builtin-list">
      {#each BUILTIN_EXERCISES as name}
        <li>{name}</li>
      {/each}
    </ul>
  </section>

  <p class="version">KneeFit v{version}</p>
</div>

<ConfirmDialog
  open={confirmTarget !== null}
  message={`Remove "${confirmTarget}" from your exercises?`}
  on:confirm={() => handleDelete(confirmTarget)}
  on:cancel={() => confirmTarget = null}
/>

<style>
  .page { padding-top: 0.5rem; }
  h1 { margin-bottom: 1.5rem; }

  section { margin-bottom: 2rem; }

  h2 { margin-bottom: 0.5rem; }

  .hint {
    font-size: 0.85rem;
    color: var(--color-text-muted);
    margin-bottom: 1rem;
  }

  .add-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .add-row input { flex: 1; }

  .add-btn {
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-sm);
    background: var(--color-accent);
    color: #0d1b2a;
    font-weight: 700;
    white-space: nowrap;
  }

  .empty {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    padding: 1rem 0;
  }

  .exercise-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .exercise-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }

  .delete-btn {
    background: none;
    color: var(--color-text-muted);
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
  }

  .builtin-section { opacity: 0.6; }

  .builtin-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .builtin-list li {
    font-size: 0.9rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(128,128,128,0.1);
    color: var(--color-text-muted);
  }

  .setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    padding: 0.75rem 1rem;
  }

  .setting-label {
    font-size: 0.95rem;
  }

  .theme-toggle {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    background: var(--color-surface-2);
    color: var(--color-text);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .theme-icon { font-size: 1rem; }

  .version {
    text-align: center;
    font-size: 0.75rem;
    color: var(--color-text-muted);
    padding: 1rem 0 0.5rem;
    opacity: 0.6;
  }
</style>
