<script>
  import '../app.css';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import Toast from '$lib/components/Toast.svelte';

  let { children } = $props();
</script>

<div class="app-shell">
  <main>
    {@render children()}
  </main>
  <BottomNav />
  <Toast />
</div>

<style>
  .app-shell {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
    padding: 1rem 1rem calc(var(--nav-height) + var(--safe-bottom) + 1rem);
    padding-top: calc(var(--safe-top) + 1rem);
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }
</style>
