<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { base } from '$app/paths';

  const tabs = [
    { href: `${base}/`, label: 'Home', icon: '🏠' },
    { href: `${base}/log-exercise`, label: 'Exercise', icon: '🏋️' },
    { href: `${base}/log-pain`, label: 'Pain', icon: '📊' },
    { href: `${base}/history`, label: 'History', icon: '📋' },
    { href: `${base}/settings`, label: 'Settings', icon: '⚙️' }
  ];

  function isActive(href) {
    const p = $page.url.pathname;
    if (href === `${base}/`) return p === href || p === `${base}`;
    return p.startsWith(href);
  }
</script>

<nav>
  {#each tabs as tab}
    <button
      class:active={isActive(tab.href)}
      on:click={() => goto(tab.href)}
      type="button"
    >
      <span class="icon">{tab.icon}</span>
      <span class="label">{tab.label}</span>
    </button>
  {/each}
</nav>

<style>
  nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    background: var(--color-surface);
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-bottom: var(--safe-bottom);
    z-index: 100;
  }

  button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0.25rem;
    color: var(--color-text-muted);
    background: none;
    transition: color 0.15s;
    min-height: 3.5rem;
    border-radius: 0;
  }

  button.active {
    color: var(--color-accent);
  }

  .icon {
    font-size: 1.25rem;
    line-height: 1;
  }

  .label {
    font-size: 0.625rem;
    font-weight: 600;
    margin-top: 0.2rem;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
</style>
