<script>
  import { createEventDispatcher, onMount } from 'svelte';
  export let open = false;
  export let message = 'Are you sure?';

  const dispatch = createEventDispatcher();
  let dialog;

  $: if (dialog) open ? dialog.showModal() : dialog.close();
</script>

<dialog bind:this={dialog} on:close={() => dispatch('cancel')}>
  <p>{message}</p>
  <div class="actions">
    <button class="cancel" on:click={() => dispatch('cancel')}>Cancel</button>
    <button class="danger" on:click={() => dispatch('confirm')}>Delete</button>
  </div>
</dialog>

<style>
  dialog {
    background: var(--color-surface-2);
    color: var(--color-text);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--radius);
    padding: 1.5rem;
    max-width: 320px;
    width: 90%;
  }

  dialog::backdrop {
    background: rgba(0,0,0,0.6);
  }

  p {
    margin-bottom: 1.25rem;
    font-size: 0.95rem;
    color: var(--color-text-muted);
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  button {
    padding: 0.6rem 1.25rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.875rem;
  }

  .cancel {
    background: var(--color-surface);
    color: var(--color-text-muted);
  }

  .danger {
    background: var(--color-danger);
    color: #fff;
  }
</style>
