<script>
  import { toast } from '$lib/stores.js';
</script>

{#if $toast}
  <div class="toast" class:error={$toast.type === 'error'} key={$toast.id}>
    {$toast.message}
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    bottom: calc(var(--nav-height) + var(--safe-bottom) + 0.75rem);
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-accent);
    color: #0d1b2a;
    font-weight: 600;
    font-size: 0.875rem;
    padding: 0.625rem 1.25rem;
    border-radius: 2rem;
    white-space: nowrap;
    z-index: 200;
    animation: slideUp 0.2s ease-out;
  }

  .toast.error {
    background: var(--color-danger);
    color: #fff;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateX(-50%) translateY(0.5rem); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
</style>
